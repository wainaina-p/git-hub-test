import React from 'react';
import { Link } from 'react-router-dom';
import styles from './notfound.module.css';
import { LikeOutlined } from '@ant-design/icons';


const NotFound = () => {
    return (
        <div className={styles.Container}>
            <LikeOutlined style={{ fontSize: 72, color: "#f68872" }} />
            <h1 className={styles.Title}>Ohh! Page Not Found</h1>
            <p>
                It seems we can't find what you're looking for. Perhaps searching can help or go back to{' '}
                <Link to="/" className={styles.Link} title="Homepage">
                    Homepage
                </Link>
            </p>
        </div>
    );
};

export default NotFound;