import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import menuItems from '../data/menuItems.js';

function MenuItems({ setCurrentPage, currentPage }) {
    const [expandedItems, setExpandedItems] = useState({});
    const [activeItem, setActiveItem] = useState('');
    const location = useLocation();

    const toggleExpanded = (item) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    // Update active item based on current URL/page
    useEffect(() => {
        const currentPath = currentPage || location.pathname.slice(1) || 'home';
        
        // Find which menu item corresponds to current path
        let foundActiveItem = null;
        
        // Check main menu items first
        const mainMenuItem = menuItems.find(item => 
            item.targetPage === currentPath || item.id === currentPath
        );
        
        if (mainMenuItem) {
            foundActiveItem = mainMenuItem.id;
        } else {
            // Check submenu items
            menuItems.forEach(item => {
                if (item.children) {
                    const childItem = item.children.find(child => 
                        child.id === currentPath
                    );
                    if (childItem) {
                        foundActiveItem = childItem.label;
                        // Auto-expand parent if child is active
                        setExpandedItems(prev => ({
                            ...prev,
                            [item.id]: true
                        }));
                    }
                }
            });
        }
        
        if (foundActiveItem) {
            setActiveItem(foundActiveItem);
        }
    }, [currentPage, location.pathname]);

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

    // Separate function for submenu items
    const handleSubmenuClick = (label, parentId, childId, targetPage) => {
        setActiveItem(label);
        setCurrentPage(targetPage || childId);
        console.log('Submenu clicked:', { label, parentId, childId, targetPage });
    };

    // Separate function for main menu items without submenus
    const handleMainMenuClick = (item) => {
        setActiveItem(item.id);
        setCurrentPage(item.targetPage);
        console.log('Main menu clicked:', { id: item.id, targetPage: item.targetPage });
    };

    return (
        <div>
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedItems[item.id];
                const isMainItemActive = activeItem === item.id;

                return (
                    <div key={item.id}>
                        <div
                            className='menu_item'
                            style={{
                                backgroundColor: isMainItemActive ? '#2563eb' : 'transparent',
                                color: isMainItemActive ? 'white' : '#374151'
                            }}
                            onClick={() => {
                                if (item.hasSubmenu) {
                                    toggleExpanded(item.id);
                                } else {
                                    handleMainMenuClick(item);
                                }
                            }}
                            onMouseEnter={(e) => handleMouseEnter(e, isMainItemActive)}
                            onMouseLeave={(e) => handleMouseLeave(e, isMainItemActive)}
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
                                    {item.children?.map((child) => {
                                        const isChildActive = activeItem === child.label || child.active;
                                        
                                        return (
                                            <div
                                                key={child.id}
                                                style={{
                                                    backgroundColor: isChildActive ? '#039DFF' : 'transparent',
                                                    color: isChildActive ? 'white' : '#6b7280',
                                                    fontWeight: isChildActive ? '700' : '600'
                                                }}
                                                onClick={() => {
                                                    handleSubmenuClick(child.label, item.id, child.id, child.id);
                                                }}
                                                onMouseEnter={(e) => handleMouseEnter(e, isChildActive)}
                                                onMouseLeave={(e) => handleMouseLeave(e, isChildActive)}
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
                                        );
                                    })}
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