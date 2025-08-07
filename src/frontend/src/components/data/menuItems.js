// src/data/menuItems.js
import { 
    Home, 
    Calculator, 
    ShoppingCart, 
    Package, 
    FileText, 
    ChevronDown,
    Users,
    Briefcase,
    DollarSign,
    Factory,
    UserCheck,
    Award,
    FolderOpen,
    Headphones,
    Settings
} from 'lucide-react';

const menuItems = [
    {
        id: 'Home',
        label: 'Home',
        icon: Home,
        hasSubmenu: false,
        targetPage: 'home'
    },
    {
        id: 'overview',
        label: 'Overview',
        icon: FileText,
        hasSubmenu: true,
        children: [
            { id: 'customer-profile', label: 'Customer Profile' },
            { id: 'released', label: 'Released' },
            { id: 'comments', label: 'Comments' },
            { id: 'scheduled', label: 'Scheduled' }
        ]
    },
    {
        id: 'accounting',
        label: 'Accounting',
        icon: Calculator,
        hasSubmenu: true,
        children: [
            { id: 'financial-reports', label: 'Laporan Keuangan' },
            { id: 'transactions', label: 'Transaksi' }
        ]
    },
    {
        id: 'buying',
        label: 'Buying',
        icon: ShoppingCart,
        hasSubmenu: true,
        children: [
            { id: 'requests', label: 'Permintaan' },
            { id: 'purchases', label: 'Pembelian' }
        ]
    },
    {
        id: 'selling',
        label: 'Selling',
        icon: DollarSign,
        hasSubmenu: true,
        children: [
            { id: 'ecommerce', label: 'Ecommerce' },
            { id: 'invoices', label: 'Invoice' },
            { id: 'orders', label: 'Order' }
        ]
    },
    {
        id: 'stock',
        label: 'Stock',
        icon: Package,
        hasSubmenu: true,
        children: [
            { id: 'inventory', label: 'Stok Barang' },
            { id: 'warehouse', label: 'Gudang' }
        ]
    },
    {
        id: 'assets',
        label: 'Assets',
        icon: Briefcase,
        hasSubmenu: false,
        targetPage: 'assets'
    },
    {
        id: 'hr',
        label: 'HR',
        icon: Users,
        hasSubmenu: true,
        children: [
            { id: 'employee-data', label: 'Data Karyawan' },
            { id: 'attendance', label: 'Kehadiran' },
            { id: 'shifts', label: 'Shift' }
        ]
    },
    {
        id: 'payroll',
        label: 'Payroll',
        icon: UserCheck,
        hasSubmenu: true,
        children: [
            { id: 'salary', label: 'Gaji' },
            { id: 'payslips', label: 'Slip Gaji' },
            { id: 'taxes', label: 'Pajak' }
        ]
    },
    {
        id: 'manufacturing',
        label: 'Manufacturing',
        icon: Factory,
        hasSubmenu: true,
        children: [
            { id: 'bom', label: 'BOM' },
            { id: 'production', label: 'Produksi' },
            { id: 'planning', label: 'Rencana' }
        ]
    },
    {
        id: 'quality',
        label: 'Quality',
        icon: Award,
        hasSubmenu: true,
        children: [
            { id: 'quality-inspection', label: 'Pemeriksaan Kualitas' }
        ]
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: FolderOpen,
        hasSubmenu: true,
        children: [
            { id: 'project-management', label: 'Proyek' },
            { id: 'tasks', label: 'Tugas' },
            { id: 'teams', label: 'Tim' }
        ]
    },
    {
        id: 'support',
        label: 'Support',
        icon: Headphones,
        hasSubmenu: true,
        children: [
            { id: 'tickets', label: 'Tiket' },
            { id: 'customers', label: 'Pelanggan' }
        ]
    },
    {
        id: 'preferences',
        label: 'Preferences',
        icon: Settings,
        hasSubmenu: false,
        targetPage: 'preferences'
    }
];

export default menuItems;
