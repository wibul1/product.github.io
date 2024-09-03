// ฟังก์ชัน normalizeInput ที่ปรับปรุงแล้ว
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');


const normalizeInput = (input) => {
    if (!input || typeof input !== 'string') return ''; // ตรวจสอบข้อมูลเข้าก่อน

    let parts = input.trim().split(/[\/\s]/).filter(Boolean); // ตัดช่องว่างและกรองค่าที่ว่าง
    if (parts.length === 1) {
        return parts[0];
    } else if (parts.length === 2) {
        return `${parts[0]}/${parts[1]}`;
    } else {
        return '';
    }
}

const scoring = (products, searchTerm, field) => {
    return products.map(product => {
        let score = 0;

        // เพิ่มคะแนนตามการตรงกันของชื่อหนังสือ
        if (product[field].toLowerCase().includes(searchTerm.toLowerCase())) {
            score += 10; // คะแนนที่เพิ่มถ้าค้นหาเจอคำที่ตรงกัน
        }

        return { ...product.toObject(), score }; // แปลงเอกสาร MongoDB เป็นออบเจ็กต์ปกติและเพิ่มคะแนน
    }).sort((a, b) => b.score - a.score); // เรียงลำดับตามคะแนนจากมากไปน้อย
}

// บริการชำระเงิน
// const processPayment = async ({ amount, paymentMethod }) => {
//     try {
//         // สร้างการชำระเงินใน Stripe
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100, // จำนวนเงินในเซนต์ (Stripe ใช้เซนต์สำหรับการทำงาน)
//             currency: 'usd',  // หรือสกุลเงินที่คุณใช้
//             payment_method: paymentMethod,  // ID ของ Payment Method จากฝั่ง client
//             confirmation_method: 'manual',
//             confirm: true,  // ยืนยันการชำระเงิน
//         });

//         // ถ้าการชำระเงินสำเร็จ
//         if (paymentIntent.status === 'succeeded') {
//             return {
//                 success: true,
//                 transactionId: paymentIntent.id,  // เก็บหมายเลขการทำธุรกรรม
//             };
//         } else {
//             return {
//                 success: false,
//                 error: `Payment failed with status ${paymentIntent.status}`,
//             };
//         }
//     } catch (error) {
//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// }


module.exports = {
    normalizeInput,
    scoring,
    // processPayment,
}