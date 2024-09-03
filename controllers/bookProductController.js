const BookProduct = require('../models/bookProductModel'); // ใช้ชื่อโมเดลให้ถูกต้อง
const Poster = require('../models/posterModel'); // ใช้ชื่อโมเดลให้ถูกต้อง
const {normalizeInput , scoring} =require('../helpers/helper')

// ฟังก์ชันสำหรับการดึงข้อมูลสินค้า
exports.product = async (req, res, next) => {
    try {
        const { id } = req.query;
        
        const product = await BookProduct.findById(id); // แก้ไขให้ถูกต้อง
        
        if (product) {
            res.status(200).send({
                message: 'Product fetched successfully',
                data: product
            });
        } else {
            res.status(404).send({
                code: 404,
                message: 'Product not found',
            });
        }
    } catch (e) {
        console.error('Error fetching product', e.message);
        next(e);
    }
}

exports.productbook = async (req, res, next) => {
    try {
        const { category } = req.query;
        
        const product = await BookProduct.find({category:category}) // แก้ไขให้ถูกต้อง
        .sort({ book_depository_stars: -1 }) // เรียงลำดับจากใหม่ไปเก่า
        .limit(10); // จำกัดจำนวนรายการที่ดึงมา
        
        if (product) {
            res.status(200).send({
                message: 'Product fetched successfully',
                data: product
            });
        } else {
            res.status(404).send({
                code: 404,
                message: 'Product not found',
            });
        }
    } catch (e) {
        console.error('Error fetching product', e.message);
        next(e);
    }
}

// ฟังก์ชันสำหรับการเพิ่มข้อมูลสินค้า
exports.putproduct = async (req, res, next) => {
    try {
        const { name, img, author, format, book_depository_stars, price, old_price, category } = req.body;
        
        const product = await BookProduct.create({  // ใช้การสร้างด้วยอ็อบเจกต์
            name, 
            img, 
            author, 
            format, 
            book_depository_stars, 
            price, 
            old_price, 
            category
        });
        
        if (product) {
            res.status(200).send({
                message: 'Product created successfully',
                data: product
            });
        } else {
            res.status(404).send({
                code: 404,
                message: 'Product creation failed',
            });
        }
    } catch (e) {
        console.error('Error creating product', e.message);
        next(e);
    }
}

exports.carousel = async (req, res, next) => {
    try {
        
        const status = "1";
        
        if (status) {
            // ค้นหาสินค้าที่มี book_depository_stars สูงสุด
            const carousel = await Poster.find({ status: status})
                .sort({ createdAt: -1 }) // เรียงลำดับจากใหม่ไปเก่า
                .limit(3); // จำกัดจำนวนรายการที่ดึงมา
            
            res.status(200).send({
                message: 'carousel fetched successfully',
                data: carousel
            });
        } else {
            res.status(404).send({
                code: 404,
                message: 'carousel not found',
            });
        }
    } catch (e) {
        console.error('Error fetching carousel', e.message);
        next(e);
    }
}


exports.postCarousel = async (req, res, next) => {
    try {
        const { name, img } = req.body;

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นใน req.body หรือไม่
        if (!name || !img) {
            return res.status(400).send({
                code: 400,
                message: 'name and img are required fields',
            });
        }
        
        // สร้าง poster ในฐานข้อมูล
        const poster = await Poster.create({ 
            name, 
            img,
        });
        
        // ตรวจสอบผลลัพธ์และตอบกลับ
        if (poster) {
            res.status(201).send({  // ใช้สถานะ 201 เมื่อสร้างสำเร็จ
                message: 'Poster created successfully',
                data: poster
            });
        } else {
            res.status(500).send({  // ใช้สถานะ 500 เมื่อเกิดข้อผิดพลาดภายใน
                code: 500,
                message: 'Poster creation failed',
            });
        }
    } catch (e) {
        console.error('Error creating poster', e.message);
        next(e);  // ส่งต่อข้อผิดพลาดไปยัง middleware สำหรับการจัดการข้อผิดพลาด
    }
}

exports.searchbook = async (req, res, next) => {
    try {
        let { namebook } = req.query;

        if (!namebook) {
            return res.status(400).send({
                code: 400,
                message: 'Query parameter namebook is required',
            });
        }

        let normalizedbook = normalizeInput(namebook);
        if (!normalizedbook) {
            return res.status(400).send({
                code: 400,
                message: 'Invalid input after normalization',
            });
        }

        const regexPattern = new RegExp(`^${normalizedbook.replace('/', '\\/')}`, 'i');
        const productbook = await BookProduct.find({ name: { $regex: regexPattern } });

        if (productbook && productbook.length > 0) {
            const results = scoring(productbook, normalizedbook, 'name');

            res.status(200).send({
                message: 'Search product book successful',
                data: results,
            });
        } else {
            res.status(404).send({
                code: 404,
                message: 'Search product book failed',
                error: "Product book not found",
            });
        }
    } catch (e) {
        console.error('Error while searching product book:', e.message);
        next(e);
    }
}

exports.highestScore = async (req, res, next) => {
    try {
        // ตรวจสอบเดือนปัจจุบัน
        const currentMonth = new Date().getMonth() + 1; // getMonth() ให้ผลลัพธ์เป็น 0-11, ต้องบวก 1

        console.log(`API called in month: ${currentMonth}`);

        // ค้นหาสินค้าใน BookProduct ที่มีคะแนนสูงสุด
        const topProducts = await BookProduct.find()
            .sort({ score: -1 })  // เรียงลำดับตามคะแนนจากมากไปน้อย
            .limit(10);            // จำกัดผลลัพธ์ที่ 10 รายการ

        res.status(200).send({
            message: 'Top 10 highest scored products fetched successfully',
            data: topProducts,
        });
    } catch (e) {
        console.error('Error while fetching highest score product books:', e.message);
        next(e);
    }
}

exports.newBook = async (req, res, next) => {
    try {
        // ตรวจสอบเดือนปัจจุบัน
        const currentMonth = new Date().getMonth() + 1; // getMonth() ให้ผลลัพธ์เป็น 0-11, ต้องบวก 1

        console.log(`API called in month: ${currentMonth}`);

        // ค้นหาสินค้าใน BookProduct ที่มีคะแนนสูงสุด
        const topProducts = await BookProduct.find()
            .sort({ create_at: -1 })  // เรียงลำดับตามคะแนนจากมากไปน้อย
            .limit(10);            // จำกัดผลลัพธ์ที่ 10 รายการ

        res.status(200).send({
            status: 200,
            message: 'Top 10 highest new products fetched successfully',
            data: topProducts,
        });
    } catch (e) {
        console.error('Error while fetching highest score product books:', e.message);
        next(e);
    }
}

exports.newBookAll = async (req, res, next) => {
    try {
        // ตรวจสอบเดือนปัจจุบัน
        const currentMonth = new Date().getMonth() + 1; // getMonth() ให้ผลลัพธ์เป็น 0-11, ต้องบวก 1

        console.log(`API called in month: ${currentMonth}`);

        // ค้นหาสินค้าใน BookProduct ที่มีคะแนนสูงสุด
        const topProducts = await BookProduct.find()
            .sort({ create_at: -1 })  // เรียงลำดับตามคะแนนจากมากไปน้อย
            .limit(100);            // จำกัดผลลัพธ์ที่ 10 รายการ

        res.status(200).send({
            status: 200,
            message: 'Top 10 highest new products fetched successfully',
            data: topProducts,
        });
    } catch (e) {
        console.error('Error while fetching highest score product books:', e.message);
        next(e);
    }
}