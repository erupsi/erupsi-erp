import React, { useState, useEffect } from 'react';
import "./main.scss"
import erupsiLogo from "@assets/images/erupsi-icon.png";

import MenuItems from './MenuItems';


const Sidenav = ({ setCurrentPage }) => {
    return (
        <nav>
            {/* Header */}
            <div className='nav_top'>
                <div>
                    <img src={erupsiLogo} alt="Erupsi Logo"/>
                    <div>
                        <h1>ERUPSI-ERP</h1>
                        <h2>Asset Management Platform</h2>
                    </div>
                </div>
            </div>

            {/* Menu Items - Scrollable */}
            <div>
                <MenuItems setCurrentPage={setCurrentPage}/>
            </div>

            {/* Bottom Section - Inbox */}
            <div className="inbox-section">
                <div className="inbox-header">
                    <span className="inbox-title">Inbox</span>
                    <span className="inbox-badge">6</span>
                </div>

                <div className="inbox-list">
                    <div className="inbox-item">
                    <div className="inbox-icon inbox-icon-blue">
                        <span>⇅</span>
                    </div>
                    <div>
                        <div className="inbox-item-title">Pesanan masuk</div>
                        <div className="inbox-item-desc">From B2B has been...</div>
                    </div>
                    </div>

                    <div className="inbox-item">
                    <div className="inbox-icon inbox-icon-gray">
                        <span>📋</span>
                    </div>
                    <div>
                        <div className="inbox-item-title">Pesanan dikirim</div>
                        <div className="inbox-item-desc">From B2B has been...</div>
                    </div>
                    </div>

                    <div className="inbox-item">
                    <div className="inbox-icon inbox-icon-green">
                        <span>✓</span>
                    </div>
                    <div>
                        <div className="inbox-item-title">Pesanan selesai</div>
                        <div className="inbox-item-desc">From B2B has been...</div>
                    </div>
                    </div>

                    <div className="inbox-item">
                    <div className="inbox-icon inbox-icon-red-round">
                        <span>!</span>
                    </div>
                    <div>
                        <div className="inbox-item-title">Complaints</div>
                        <div className="inbox-item-desc">Asrog B2SOM has been...</div>
                    </div>
                    </div>
                </div>
            </div>

        </nav>
    );
}

export default Sidenav;