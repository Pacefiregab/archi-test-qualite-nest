import { PdfDocument } from "@ironsoftware/ironpdf";
import { Order } from "../domain/entity/order.entity";
import { PdfServiceInterface } from "../domain/port/invoice.generator.interface";

export default class PdfService implements PdfServiceInterface {

    generateInvoice(order: Order): Promise<any> {
        const orderItemsHtml = order.orderItems.map(item => `
            <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.price} €</td>
            </tr>
        `).join('');

        const pdf = PdfDocument.fromHtml(
            `<html>
            <head>
            <title>Facture</title>
            </head>
            <body>
            <h1>Facture</h1>
            <p>Commande n°: ${order.id}</p>
            <p>Client: ${order.customerName}</p>
            <p>Montant: ${order.price} €</p>
            <p>Date: ${order.createdAt}</p>
            <h2>Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
            </table>
            </body>
            </html>`
        );

        return pdf;
    }
}