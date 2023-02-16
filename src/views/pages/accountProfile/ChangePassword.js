import { Form, Input, Button, Row,  } from 'antd';
import {  LockOutlined } from '@ant-design/icons';
import { useState } from 'react';

const UpdatePassword = () => {
  const [isDisabled, setDisabled] = useState(false);

  const onFinish = (values) => {
    // console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name='basic'
      wrapperCol={{
        span: 24,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item
        name='currentPassword'
        rules={[
          {
            required: true,
            message: 'Please input your old password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder='Current password'
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name='password'
        dependencies={['currentPassword']}
        rules={[
          {
            required: true,
            message: 'Please input new password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('currentPassword') !== value) {
                setDisabled(false);
                return Promise.resolve();
              }
              setDisabled(true);
              return Promise.reject(
                new Error('Old password and new password cannot be the same!')
              );
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          style={{ width: '100%' }}
          placeholder='New password'
        />
      </Form.Item>

      <Form.Item
        name='confirmPassword'
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error('The two passwords that you entered do not match!')
              );
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder='Confirm password'
          style={{ width: '100%' }}
          disabled={isDisabled}
        />
      </Form.Item>

      <Row justify='end'>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
export default UpdatePassword;
