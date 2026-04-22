import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { toWords } from 'number-to-words';

const InvoicePDF = ({ order, onDownloadComplete }) => {
    const invoiceRef = useRef();

    const handleDownload = async () => {
        const element = invoiceRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${order.orderId || order._id}.pdf`);
        if (onDownloadComplete) onDownloadComplete();
    };

    if (!order) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="flex flex-col items-center py-10 bg-gray-100 min-h-screen">
            <button 
                onClick={handleDownload}
                className="mb-8 bg-[#16a34a] hover:bg-[#15803d] text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
            >
                Download PDF Invoice
            </button>

            {/* Invoice Container - Hidden from normal view but used for PDF generation */}
            <div className="bg-white p-0 shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
                <div ref={invoiceRef} className="p-4 text-[11px] font-sans text-black bg-white" style={{ width: '210mm' }}>
                    
                    {/* Header Top Border */}
                    <div className="border-t-2 border-black mb-1"></div>

                    {/* Main Header */}
                    <div className="grid grid-cols-12 border-b-2 border-black pb-2">
                        {/* Left: Company Details */}
                        <div className="col-span-5 pr-4 border-r border-gray-300">
                            <h1 className="text-3xl font-black tracking-tight leading-none mb-1">DAS ENTERPRISE</h1>
                            <p className="font-bold">KUNTIGHAT, SHERPUR, NAYASARAI</p>
                            <p className="font-bold">HOOGHLY, 712513.</p>
                            <p className="mt-2 font-bold">Phone : 9330113049, 8820201177</p>
                            <p className="font-bold">E-Mail : das21enterprise@gmail.com</p>
                            <p className="font-bold">GSTIN : 19BZPD4562K1ZG</p>
                        </div>

                        {/* Center: Logo & Title */}
                        <div className="col-span-3 flex flex-col items-center justify-center border-r border-gray-300">
                            <div className="w-16 h-16 mb-2">
                                {/* Simple Ganesha SVG placeholder */}
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="1" />
                                    <text x="50" y="55" fontSize="10" textAnchor="middle" fontWeight="bold">OM</text>
                                </svg>
                            </div>
                            <div className="border border-black px-4 py-1 font-black text-sm uppercase">
                                GST INVOICE
                            </div>
                        </div>

                        {/* Right: Customer Details */}
                        <div className="col-span-4 pl-4">
                            <h2 className="text-sm font-black uppercase">M/s {order.shopName || order.dealer?.shopName}</h2>
                            <p className="font-bold italic uppercase">{order.area || 'N/A'}</p>
                            <p className="font-bold mt-1">State : 19 19-WEST BENGAL</p>
                            <p className="font-bold">Ph.No.: {order.phone || order.dealer?.phone}</p>
                            <p className="font-bold">GST : {order.dealer?.gstin || ''}</p>
                        </div>
                    </div>

                    {/* Invoice Meta Data */}
                    <div className="grid grid-cols-3 border-b-2 border-black py-1">
                        <div className="border-r border-gray-300 px-2 flex justify-between">
                            <span className="font-bold">Invoice No. :</span>
                            <span className="font-black uppercase">{order._id.toString().slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="border-r border-gray-300 px-2 flex justify-between">
                            <span className="font-bold">Date :</span>
                            <span className="font-black">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="px-2 flex justify-between">
                            <span className="font-bold">Sales Man :</span>
                            <span className="font-black">PRASENJIT DAS</span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full border-collapse border-b-2 border-black">
                        <thead>
                            <tr className="border-b border-black text-[10px]">
                                <th className="border-r border-black p-1 w-8">Sn.</th>
                                <th className="border-r border-black p-1 text-left">PRODUCT</th>
                                <th className="border-r border-black p-1 w-12 text-right">MRP</th>
                                <th className="border-r border-black p-1 w-10 text-right">PCS</th>
                                <th className="border-r border-black p-1 w-16 text-right">HSN</th>
                                <th className="border-r border-black p-1 w-16 text-right">RATE</th>
                                <th className="border-r border-black p-1 w-10 text-right">DIS%</th>
                                <th className="border-r border-black p-1 w-16 text-right">GST%</th>
                                <th className="border-r border-black p-1 w-20 text-right">NET-RATE</th>
                                <th className="p-1 w-24 text-right font-black">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="border-r border-black p-1 text-center font-bold">{index + 1}.</td>
                                    <td className="border-r border-black p-1 font-bold uppercase">{item.productName}</td>
                                    <td className="border-r border-black p-1 text-right">{(item.mrp || 0).toFixed(2)}</td>
                                    <td className="border-r border-black p-1 text-right font-bold">{item.quantity}</td>
                                    <td className="border-r border-black p-1 text-right">{item.hsnCode || 'N/A'}</td>
                                    <td className="border-r border-black p-1 text-right font-bold">{(item.price || 0).toFixed(2)}</td>
                                    <td className="border-r border-black p-1 text-right">{(item.discountPercent || 0).toFixed(2)}</td>
                                    <td className="border-r border-black p-1 text-right">{(item.gstPercent || 0).toFixed(2)}</td>
                                    <td className="border-r border-black p-1 text-right font-bold">{(item.total / item.quantity).toFixed(2)}</td>
                                    <td className="p-1 text-right font-black">{(item.total || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                            {/* Empty rows to maintain height */}
                            {[...Array(Math.max(0, 10 - order.items.length))].map((_, i) => (
                                <tr key={`empty-${i}`} className="h-6">
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td className="border-r border-black"></td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals Section */}
                    <div className="grid grid-cols-12 border-b-2 border-black">
                        {/* Tax Breakdown Table */}
                        <div className="col-span-4 border-r border-black p-1">
                            <table className="w-full text-[9px]">
                                <thead>
                                    <tr className="border-b border-black font-black uppercase">
                                        <th className="text-left">Taxable Valu</th>
                                        <th className="text-center">Tax %</th>
                                        <th className="text-right">CGST</th>
                                        <th className="text-right">SGST</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(order.taxBreakdown || []).map((slab, i) => (
                                        <tr key={i}>
                                            <td className="font-bold">{slab.taxableValue.toFixed(2)}</td>
                                            <td className="text-center font-bold">{slab.slab}</td>
                                            <td className="text-right font-bold">{slab.cgst.toFixed(2)}</td>
                                            <td className="text-right font-bold">{slab.sgst.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Middle: Signature/Reciever */}
                        <div className="col-span-3 border-r border-black p-2 flex flex-col justify-between">
                            <div className="font-black text-center text-[12px] mt-4">Reciever</div>
                            <div className="font-black text-center border-t border-black pt-1 italic uppercase">Scan & Pay</div>
                        </div>

                        {/* QR Code Section */}
                        <div className="col-span-2 border-r border-black p-2 flex items-center justify-center">
                            <QRCodeSVG 
                                value={`upi://pay?pa=das21enterprise@okicici&pn=DAS%20ENTERPRISE&am=${order.totalPrice}&cu=INR`} 
                                size={60}
                            />
                        </div>

                        {/* Grand Totals */}
                        <div className="col-span-3 p-1">
                            <div className="flex justify-between font-bold">
                                <span>GROSS TOTAL</span>
                                <span>{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>GST TOTAL</span>
                                <span>{order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold border-b border-black pb-1 mb-1">
                                <span>CASH DISCOUNT</span>
                                <span>0.00</span>
                            </div>
                            <div className="flex justify-between font-black text-[14px]">
                                <span>GRAND TOTAL</span>
                                <span>₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="py-2 border-b-2 border-black">
                        <p className="font-black italic uppercase">
                            Rs. {toWords(Math.round(order.totalPrice)).replace(/,/g, '')} only
                        </p>
                    </div>

                    <div className="grid grid-cols-2 mt-2">
                        <div>
                            <h4 className="font-black underline uppercase text-[10px] mb-1">Terms & Conditions</h4>
                            <ul className="list-disc pl-4 font-bold text-[9px] space-y-0.5">
                                <li>Goods once sold will not be taken back or exchanged.</li>
                                <li>Bills not paid due date will attract 24% interest.</li>
                                <li>Subject to Hooghly Jurisdiction.</li>
                            </ul>
                        </div>
                        <div className="flex flex-col items-end justify-end">
                            <p className="font-bold text-[9px]">For DAS ENTERPRISE</p>
                            <div className="h-10"></div>
                            <p className="font-black border-t border-black pt-1 px-4 text-[10px]">Authorized Signatory</p>
                        </div>
                    </div>

                    {/* Page Numbers / Footer Info */}
                    <div className="mt-4 flex justify-between text-[8px] font-bold text-gray-400 italic">
                        <span>Generated by Paimon-2005 Order System</span>
                        <span>Page 1 of 1</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvoicePDF;
