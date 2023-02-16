import React from 'react';
import { Menu } from 'antd';
const LanguageMenu = ({ locales, onMenuClick }) => (
    <Menu onClick={onMenuClick}>
        {Object.keys(locales).map(locale => (
            <Menu.Item key={locale}>
                &nbsp;{locales[locale]}
            </Menu.Item>
        ))}
    </Menu >
);
export default LanguageMenu;