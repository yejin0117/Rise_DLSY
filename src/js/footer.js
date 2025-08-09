import React from 'react';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="gradient-bg text-white mt-12">
            <div className="container mx-auto px-6 py-8 footer-container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 footer-grid">
                    <div className="text-center md:text-left">
                            <h4 className="text-xl font-bold">디지털 문해력 챌린지</h4>
                        <p className="text-xl text-sm opacity-80">
                            디지털 시대의 필수 능력을 키우는 교육 플랫폼
                        </p>
                    </div>
                    <div className="text-center md:text-right">
                        <h4 className="text-lg font-semibold mb-4">문의하기</h4>
                        <p className="text-lg text-sm opacity-80">
                            이메일: ___@___.com
                        </p>
                    </div>
                </div>
                <div className="footer-divider my-8"></div>
                <div className="text-center text-sm opacity-60">
                    <p>&copy; {new Date().getFullYear()} 디지털 문해력 챌린지 by DLYS. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
