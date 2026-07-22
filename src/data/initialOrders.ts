import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'RAC-2026-1042',
    orderDate: '2026-07-21 14:30',
    customer: {
      id: 'CUST-8821',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98201 44512',
      address: '402 Sunset Towers, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
      totalOrdersCount: 3
    },
    items: [
      {
        id: 'ART-901',
        title: 'Golden Sunset Over Marine Drive',
        category: 'Oil Painting',
        dimensions: '30x40 inches',
        framed: true,
        quantity: 1,
        unitPrice: 24500,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
        artistNote: 'Textured palette knife oil application with teakwood floating frame.'
      }
    ],
    subtotal: 24500,
    tax: 2940,
    shippingFee: 0,
    totalAmount: 27440,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    deliveryStatus: 'Processing',
    courierName: 'Blue Dart Express',
    estimatedDeliveryDate: '2026-07-25',
    cancellationStatus: 'None',
    deliveryLogs: [
      {
        timestamp: '2026-07-21 14:30',
        status: 'Order Placed',
        updatedBy: 'Customer (Web Portal)',
        notes: 'Order received and verified via UPI payment.'
      },
      {
        timestamp: '2026-07-21 16:10',
        status: 'Processing',
        updatedBy: 'Rutuja V.',
        notes: 'Varnish coating layer complete. Sent for floating wooden frame installation.'
      }
    ],
    specialInstructions: 'Please handle with care. Fragile artwork canvas.',
    isUrgent: false
  },
  {
    id: 'RAC-2026-1041',
    orderDate: '2026-07-20 09:15',
    customer: {
      id: 'CUST-8819',
      name: 'Priya Kulkarni',
      email: 'priya.k@example.com',
      phone: '+91 97654 12389',
      address: 'Flat 12B, Green Meadows, Kalyani Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411006',
      country: 'India',
      totalOrdersCount: 1
    },
    items: [
      {
        id: 'ART-882',
        title: 'Mystic Radha Krishna Charcoal Portrait',
        category: 'Charcoal Sketch',
        dimensions: '18x24 inches',
        framed: true,
        quantity: 1,
        unitPrice: 12800,
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
        artistNote: 'Fixative sealed smooth charcoal on 300GSM Canson paper with anti-glare glass frame.'
      }
    ],
    subtotal: 12800,
    tax: 1536,
    shippingFee: 350,
    totalAmount: 14686,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    deliveryStatus: 'Cancellation Requested' as any, // handled via cancellationStatus
    cancellationStatus: 'Cancellation Requested',
    cancellationReason: 'Customer ordered wrong frame color (wants dark walnut instead of white glass frame).',
    cancellationRequestedAt: '2026-07-21 18:40',
    cancellationNotes: 'Customer contacted on WhatsApp asking if we can cancel or modify the frame order.',
    deliveryLogs: [
      {
        timestamp: '2026-07-20 09:15',
        status: 'Order Placed',
        updatedBy: 'Customer (Web Portal)',
        notes: 'Order confirmed with Credit Card.'
      },
      {
        timestamp: '2026-07-20 11:30',
        status: 'Framing & Packing',
        updatedBy: 'Rutuja V.',
        notes: 'Frame mounted.'
      }
    ],
    isUrgent: true
  },
  {
    id: 'RAC-2026-1040',
    orderDate: '2026-07-19 11:00',
    customer: {
      id: 'CUST-7712',
      name: 'Vikramaditya Roy',
      email: 'v.roy@example.com',
      phone: '+91 98112 99081',
      address: '77 Golf Links Enclave',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110003',
      country: 'India',
      totalOrdersCount: 5
    },
    items: [
      {
        id: 'ART-910',
        title: 'Ocean Breeze Geode Resin Wall Clock',
        category: 'Resin Art',
        dimensions: '20x20 inches',
        framed: false,
        quantity: 1,
        unitPrice: 18500,
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80',
        artistNote: 'Epoxy resin on birchwood substrate with gold leaf accents & quartz movement.'
      },
      {
        id: 'ART-911',
        title: 'Miniature Abstract Fluid Resin Coaster Set (4 pcs)',
        category: 'Resin Art',
        dimensions: '4x4 inches',
        framed: false,
        quantity: 1,
        unitPrice: 3200,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 21700,
    tax: 2604,
    shippingFee: 0,
    totalAmount: 24304,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    deliveryStatus: 'Out for Delivery',
    courierName: 'Delhivery Surface',
    trackingNumber: 'DEL-889920194',
    estimatedDeliveryDate: '2026-07-22',
    cancellationStatus: 'None',
    deliveryLogs: [
      {
        timestamp: '2026-07-19 11:00',
        status: 'Order Placed',
        updatedBy: 'Customer',
        notes: 'Paid via GPay.'
      },
      {
        timestamp: '2026-07-19 15:20',
        status: 'Processing',
        updatedBy: 'Rutuja V.',
        notes: 'Resin cure check complete. Polished edges.'
      },
      {
        timestamp: '2026-07-20 10:00',
        status: 'Framing & Packing',
        updatedBy: 'Dispatch Desk',
        notes: 'Packed in double wooden crate with bubble cushioning.'
      },
      {
        timestamp: '2026-07-20 17:45',
        status: 'Shipped',
        updatedBy: 'Dispatch Desk',
        notes: 'Handed to Delhivery. Waybill #DEL-889920194',
        courier: 'Delhivery Surface',
        trackingNumber: 'DEL-889920194'
      },
      {
        timestamp: '2026-07-22 08:30',
        status: 'Out for Delivery',
        updatedBy: 'Delhivery Courier Agent (Rajesh M.)',
        notes: 'Dispatched for final door delivery in Golf Links hub.'
      }
    ]
  },
  {
    id: 'RAC-2026-1039',
    orderDate: '2026-07-18 16:45',
    customer: {
      id: 'CUST-6504',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@example.com',
      phone: '+91 94220 88712',
      address: 'B-304 Lakeview Manor, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102',
      country: 'India',
      totalOrdersCount: 2
    },
    items: [
      {
        id: 'ART-780',
        title: 'Custom Family Portrait in Oil Pastel',
        category: 'Custom Commission',
        dimensions: '24x30 inches',
        framed: true,
        quantity: 1,
        unitPrice: 32000,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
        artistNote: 'Hand-painted custom commission from anniversary reference photo.'
      }
    ],
    subtotal: 32000,
    tax: 3840,
    shippingFee: 0,
    totalAmount: 35840,
    paymentMethod: 'NetBanking',
    paymentStatus: 'Paid',
    deliveryStatus: 'Delivered',
    courierName: 'Blue Dart Air',
    trackingNumber: 'BD-33019827',
    estimatedDeliveryDate: '2026-07-21',
    cancellationStatus: 'None',
    deliveryLogs: [
      {
        timestamp: '2026-07-18 16:45',
        status: 'Order Placed',
        updatedBy: 'Customer',
        notes: 'Commission deposit paid.'
      },
      {
        timestamp: '2026-07-19 14:00',
        status: 'Shipped',
        updatedBy: 'Dispatch Desk',
        notes: 'Dispatched via Blue Dart Air Express.',
        courier: 'Blue Dart Air',
        trackingNumber: 'BD-33019827'
      },
      {
        timestamp: '2026-07-21 13:10',
        status: 'Delivered',
        updatedBy: 'Blue Dart Courier',
        notes: 'Delivered and signed by Ananya Deshmukh. Customer feedback: Exceeded expectations!'
      }
    ]
  },
  {
    id: 'RAC-2026-1038',
    orderDate: '2026-07-17 10:20',
    customer: {
      id: 'CUST-9102',
      name: 'Rohan Mehta',
      email: 'rohan.m@example.com',
      phone: '+91 98921 55621',
      address: '15 Palasia Square',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      country: 'India'
    },
    items: [
      {
        id: 'ART-654',
        title: 'Monsoon Serenity Lotus Pond Canvas',
        category: 'Acrylic Canvas',
        dimensions: '36x48 inches',
        framed: true,
        quantity: 1,
        unitPrice: 28000,
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 28000,
    tax: 3360,
    shippingFee: 500,
    totalAmount: 31860,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Refunded',
    deliveryStatus: 'Cancelled',
    cancellationStatus: 'Cancellation Approved',
    cancellationReason: 'Customer requested cancellation due to relocating before delivery date.',
    cancellationRequestedAt: '2026-07-17 15:00',
    cancellationProcessedAt: '2026-07-17 16:30',
    cancellationNotes: 'Approved full refund of ₹31,860 to UPI ID rohan.m@okaxis. Restocked canvas painting ART-654.',
    refundAmount: 31860,
    deliveryLogs: [
      {
        timestamp: '2026-07-17 10:20',
        status: 'Order Placed',
        updatedBy: 'Customer',
        notes: 'Order confirmed.'
      },
      {
        timestamp: '2026-07-17 16:30',
        status: 'Cancelled',
        updatedBy: 'Admin (Rutuja V.)',
        notes: 'Cancellation confirmed and full refund processed.'
      }
    ]
  },
  {
    id: 'RAC-2026-1037',
    orderDate: '2026-07-16 19:10',
    customer: {
      id: 'CUST-5510',
      name: 'Dr. Srinivas Rao',
      email: 'srinivas.rao@example.com',
      phone: '+91 98490 11209',
      address: 'Plot 42, Jubilee Hills Road No 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      country: 'India'
    },
    items: [
      {
        id: 'ART-990',
        title: 'Royal Elephant Heritage Gold Foil Triptych',
        category: 'Acrylic Canvas',
        dimensions: '3 sets of 18x36 inches',
        framed: true,
        quantity: 1,
        unitPrice: 45000,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
        artistNote: 'Custom 24k gold leaf foil accents on deep royal navy acrylic back drop.'
      }
    ],
    subtotal: 45000,
    tax: 5400,
    shippingFee: 0,
    totalAmount: 50400,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    deliveryStatus: 'Framing & Packing',
    courierName: 'DTDC Premium Cargo',
    estimatedDeliveryDate: '2026-07-26',
    cancellationStatus: 'None',
    deliveryLogs: [
      {
        timestamp: '2026-07-16 19:10',
        status: 'Order Placed',
        updatedBy: 'Customer',
        notes: 'High-value order confirmed via Amex.'
      },
      {
        timestamp: '2026-07-18 10:00',
        status: 'Processing',
        updatedBy: 'Rutuja V.',
        notes: 'Final varnish coat applied and dried.'
      },
      {
        timestamp: '2026-07-21 11:15',
        status: 'Framing & Packing',
        updatedBy: 'Packaging Team',
        notes: 'Custom mahogany wooden frames fitted with corner shock protection.'
      }
    ],
    isUrgent: true
  }
];
