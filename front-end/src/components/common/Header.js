import React, {useState, useEffect} from 'react';
import {Menubar} from 'primereact/menubar';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Avatar} from 'primereact/avatar';
import {useNavigate} from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const handleAuthAction = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setIsLoggedIn(false);
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleCartClick = () => {
        if (isLoggedIn) {
            navigate('/cart');
        } else {
            alert('Vui lòng đăng nhập để xem giỏ hàng.');
            navigate('/login');
        }
    };

    const handleAppoinmentClick = () => {
        if (isLoggedIn) {
            navigate('/appointment');
        } else {
            alert('Vui lòng đăng nhập để đặt lịch hẹn.');
            navigate('/login');
        }
    };

    const items = [
        {
            label: 'Trang Chủ',
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/')
        },
        {
            label: 'Sản Phẩm',
            icon: 'pi pi-fw pi-list',
            command: () => navigate('/products')
        },
        {
            label: 'Giỏ Hàng',
            icon: 'pi pi-fw pi-shopping-cart',
            command: handleCartClick
        },
        {
            label: 'Bài Viết',
            icon: 'pi pi-fw pi-file',
            command: () => navigate('/articles')
        },
        {
            label: 'Lịch Hẹn',
            icon: 'pi pi-fw pi-calendar',
            command: handleAppoinmentClick
        },
        {
            label: 'Liên Hệ',
            icon: 'pi pi-fw pi-envelope',
            command: () => navigate('/contact')
        },
        {
            label: 'Về Chúng Tôi',
            icon: 'pi pi-fw pi-info-circle',
            command: () => navigate('/about')
        },
    ];

    const start = <img alt="logo" src="../img/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="flex align-items-center gap-3">
            <form onSubmit={handleSearch} className="p-inputgroup">
                <InputText
                    placeholder="Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                    icon="pi pi-search"
                    className="p-button-primary"
                    type="submit"
                />
            </form>
            {isLoggedIn ? (
                <Avatar icon="pi pi-user" shape="circle"/>
            ) : null}
            <Button
                icon={isLoggedIn ? "pi pi-sign-out" : "pi pi-sign-in"}
                onClick={handleAuthAction}
                className="p-button-rounded p-button-info"
            />
        </div>
    );

    return (
        <div className="header-container">
            <Menubar model={items} start={start} end={end}/>
        </div>
    );
};

export default Header;