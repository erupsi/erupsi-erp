import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./main.scss";
import menuItems from '../data/menuItems.js';

const TopBar = ({ setCurrentPage, currentPage, grandchildItems = [] }) => {
    const [breadcrumbData, setBreadcrumbData] = useState({
        parent: null,
        current: null,
        siblings: []
    });
    const [currentGrandchild, setCurrentGrandchild] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Parse current grandchild from URL on path change
    useEffect(() => {
        const pathParts = location.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 1) {
            setCurrentGrandchild(pathParts[1]);
        } else {
            setCurrentGrandchild(null);
        }
    }, [location.pathname]);

    // Build parent/current/sibling breadcrumb structure
    useEffect(() => {
        let foundParent = null;
        let foundCurrent = null;
        let siblings = [];

        const mainMenuItem = menuItems.find(item =>
            item.targetPage === currentPage || item.id === currentPage
        );

        if (mainMenuItem && !mainMenuItem.hasSubmenu) {
            foundCurrent = mainMenuItem;
            siblings = [];
        } else {
            menuItems.forEach(parentItem => {
                if (parentItem.hasSubmenu && parentItem.children) {
                    const childItem = parentItem.children.find(child =>
                        child.id === currentPage
                    );

                    if (childItem) {
                        foundParent = parentItem;
                        foundCurrent = childItem;
                        siblings = parentItem.children;
                    }
                }
            });
        }

        setBreadcrumbData({
            parent: foundParent,
            current: foundCurrent,
            siblings: siblings
        });
    }, [currentPage]);

    const handleSiblingClick = (siblingId) => {
        const parent = breadcrumbData.parent;

        if (parent?.hasSubmenu) {
            const child = parent.children.find(c => c.id === siblingId);
            if (child?.children && child.children.length > 0) {
                navigate(`/${siblingId}/${child.children[0].id}`);
            } else {
                navigate(`/${siblingId}`);
            }
        } else {
            navigate(`/${siblingId}`);
        }

        setCurrentPage(siblingId);
    };

    const handleGrandchildClick = (grandchildId) => {
        navigate(`/${currentPage}/${grandchildId}`);
        setCurrentGrandchild(grandchildId); // update state
    };


    const renderBreadcrumb = () => {
        const { parent, current, siblings } = breadcrumbData;

        if (!current) {
            return <span className="path-text">Loading...</span>;
        }

        return (
            <div className="breadcrumb">
                <span className="path-text selected parent">{parent?.label}</span>
                {parent && <span className="path-separator"> / </span>}

                <span className="path-text siblings">
                    {siblings.length > 0 ? (
                        siblings.map((sibling, index) => (
                            <span key={sibling.id}>
                                <span
                                    className={`sibling ${sibling.id === currentPage ? 'selected' : 'clickable'}`}
                                    onClick={() => sibling.id !== currentPage && handleSiblingClick(sibling.id)}
                                >
                                    {sibling.label}
                                    {sibling.badge && (
                                        <span className={`badge ${sibling.badgeColor || 'bg-gray-400'}`}>
                                            {sibling.badge}
                                        </span>
                                    )}
                                </span>
                                {index < siblings.length - 1 && <span className="separator"> </span>}
                            </span>
                        ))
                    ) : (
                        <span className="current">{current.label}</span>
                    )}
                </span>

                {/* Grandchildren here */}
                {grandchildItems.length > 0 && (
                    <>
                        <span className="path-separator"> / </span>
                        <div className="path-text siblings">
                            {grandchildItems.map((item) => (
                                <span
                                    key={item.id}
                                    className={`${item.id === currentGrandchild ? 'selected' : 'clickable'}`}
                                    onClick={() => item.id !== currentGrandchild && handleGrandchildClick(item.id)}
                                >
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="top-bar">
            <div className="path">
                {renderBreadcrumb()}
            </div>
            <div className="account">
                <div>
                    <div className="image">
                        <img className='w-10 h-10' src="https://i.pravatar.cc/150?img=3" alt="User Avatar" />
                    </div>
                    <div className="info">
                        <div>
                            <span className="name">John Doe</span>
                            <span className="role">Admin</span>
                        </div>
                        <div>
                            <button>
                                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <path d="M20,44c0-3.3,2.7-6,6-6s6,2.7,6,6s-2.7,6-6,6S20,47.3,20,44z M20,26c0-3.3,2.7-6,6-6s6,2.7,6,6
                                    s-2.7,6-6,6S20,29.3,20,26z M20,8c0-3.3,2.7-6,6-6s6,2.7,6,6s-2.7,6-6,6S20,11.3,20,8z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
