// src/modules/order/order.service.js
import {
    findOrdersByUserId as findOrdersByUserIdRepo,
    createOrder as createOrderRepo,
} from "./order.repository.js";
// Impor ini hanya simulasi, nantinya akan diganti dengan service/repo cart asli
import {getCartByUserId, clearCart} from "../cart/cart.service.js";
import {createSalesOrder} from "../../clients/inventory.client.js";
import {createInvoice} from "../../clients/financial.client.js";

/**
 * Service untuk mengambil riwayat pesanan user.
 * @param {string} userId - ID user.
 * @return {Promise<Array>} List riwayat pesanan.
 */
const getOrderHistory = async (userId) => {
    const orders = await findOrdersByUserIdRepo(userId);
    return orders;
};

/**
 * Service untuk memproses checkout dan membuat pesanan.
 * @param {string} userId - ID user yang melakukan checkout.
 * @param {object} checkoutData - Data dari body request, misal metode pembayaran.
 * @return {Promise<object>} Data konfirmasi pesanan.
 */
const checkout = async (userId, checkoutData) => {
    // 1. Ambil data keranjang user (ini akan memanggil cart.service)
    const userCart = await getCartByUserId(userId);
    if (!userCart || userCart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    // 2. TODO: Validasi stok untuk setiap item di keranjang

    // 3. Hitung total harga
    const totalAmount = userCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0,
    );

    // 4. (Simulasi) Panggil layanan eksternal
    const salesOrder = await createSalesOrder(userCart.items);
    const invoice = await createInvoice(totalAmount, checkoutData.paymentMethod);

    // 5. Siapkan data untuk disimpan ke database
    const orderData = {
        userId,
        soNumber: salesOrder.soNumber, // Nomor dari service inventory
        invoiceId: invoice.id, // ID dari service financial
        totalAmount,
        status: "PENDING_PAYMENT",
    };

    const orderItemsData = userCart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
    }));

    // 6. Simpan ke database menggunakan transaksi
    const newOrder = await createOrderRepo(orderData, orderItemsData);

    // 7. Bersihkan keranjang user
    await clearCart(userId);

    // 8. Kembalikan data sesuai skema OrderResponse
    return {
        orderId: newOrder.id,
        so_number: newOrder.soNumber,
        status: newOrder.status,
        order_date: newOrder.createdAt,
        total_amount: newOrder.totalAmount,
        paymentDetails: {
            invoiceId: invoice.id,
            virtualAccountNumber: invoice.virtualAccountNumber,
        },
    };
};

export {
    getOrderHistory,
    checkout,
};
