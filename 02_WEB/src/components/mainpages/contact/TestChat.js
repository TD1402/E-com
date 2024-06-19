import React from 'react';
import classNames from 'classnames/bind';
import styles from './TestChat.module.scss';

const cx = classNames.bind(styles);
function TestChat() {
    return (
        <div className={cx('App')}>
            <div className={cx('container')}>
                <div className={cx('column')}>
                    <div className={cx('col-md-8')}>
                        <MessageList />
                    </div>
                    <div className={cx('col-md-4')}>
                        <ContactInput />
                    </div>
                </div>
            </div>
        </div>
    );
}

const MessageList = () => (
    <ul className={cx('list-group')}>
        <li className={cx('list-group-item')}>Hello</li>
        <li className={cx('list-group-item')}>How are you?</li>
        {/* Add more messages as needed */}
    </ul>
);

const ContactInput = () => (
    <form>
        <div className={cx('input-group')}>
            <input type="text" className={cx('form-control')} placeholder="Type your message..." />
            <div className={cx('input-group-append')}>
                <button className={cx('btn btn-outline-secondary')} type="submit">
                    Send
                </button>
            </div>
        </div>
    </form>
);

export default TestChat;
