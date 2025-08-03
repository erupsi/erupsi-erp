import React, { useState, useEffect } from 'react';
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

function MenuItems({ setCurrentPage }){
    const [expandedItems, setExpandedItems] = useState({});
    const [activeItem, setActiveItem] = useState('E-Market');

    const toggleExpanded = (item) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const setActive = (item) => {
        setActiveItem(item);
    };

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
                { id: 'released', label: 'Released', badge: '8', badgeColor: 'bg-orange-400' },
                { id: 'comments', label: 'Comments' },
                { id: 'scheduled', label: 'Scheduled', badge: '3', badgeColor: 'bg-green-400' }
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
                { id: 'sales', label: 'E-Market' },
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

    useEffect(() => {
        setExpandedItems({ selling: true });
    }, []);

    const handleMouseEnter = (e, isActive) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
        }
    };

    const handleMouseLeave = (e, isActive) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
        }
    };

    const handleSubmenuClick = (label, parentId, childId, targetPage) => {
        setActive(label);
        setCurrentPage(targetPage || 'template');
        console.log(targetPage) // sesuaikan var 'currentPage' dalam app.jsx dengan targetPage
    };

    return (
        <div>
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedItems[item.id];

                return (
                    <div key={item.id}>
                        <div
                            className='menu_item'
                            style={{
                                backgroundColor: activeItem === item.id ? '#2563eb' : 'transparent',
                                color: activeItem === item.id ? 'white' : '#374151'
                            }}
                            onClick={() => {
                                if (item.hasSubmenu) {
                                    toggleExpanded(item.id);
                                } else {
                                    handleSubmenuClick(item.label, item.id, item.id, item.targetPage);
                                }
                            }}
                            onMouseEnter={(e) => handleMouseEnter(e, activeItem === item.id)}
                            onMouseLeave={(e) => handleMouseLeave(e, activeItem === item.id)}
                        >
                            <div>
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </div>
                            {item.hasSubmenu && (
                                <div style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                                    <ChevronDown size={16} />
                                </div>
                            )}
                        </div>

                        {item.hasSubmenu && (
                            <div
                                className='sub_menu_item'
                                style={{
                                    maxHeight: isExpanded ? `${(item.children?.length || 0) * 48}px` : '0px',
                                    opacity: isExpanded ? 1 : 0,
                                    transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)'
                                }}
                            >
                                <div>
                                    {item.children?.map((child) => (
                                        <div
                                            key={child.id}
                                            style={{
                                                backgroundColor: (activeItem === child.label || child.active) ? '#2563eb' : 'transparent',
                                                color: (activeItem === child.label || child.active) ? 'white' : '#6b7280'
                                            }}
                                            onClick={() => {
                                                handleSubmenuClick(child.label, item.id, child.id, child.id);
                                            }}
                                            onMouseEnter={(e) => handleMouseEnter(e, activeItem === child.label || child.active)}
                                            onMouseLeave={(e) => handleMouseLeave(e, activeItem === child.label || child.active)}
                                        >
                                            <div>
                                                <div></div>
                                                <span>{child.label}</span>
                                            </div>
                                            {child.badge && (
                                                <span style={{
                                                    backgroundColor: child.badgeColor === 'bg-orange-400' ? '#fb923c' :
                                                        child.badgeColor === 'bg-green-400' ? '#4ade80' : '#9ca3af'
                                                }}>
                                                    {child.badge}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default MenuItems;
