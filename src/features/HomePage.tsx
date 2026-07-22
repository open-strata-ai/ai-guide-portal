import React from 'react';
import { Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

/** Boot home page — "start in 5 seconds" (DESIGN §13.4 / §4.2). */
export function HomePage() {
  const navigate = useNavigate();
  return (
    <Card style={{ maxWidth: 560, margin: '40px auto', textAlign: 'center' }}>
      <Typography.Title level={3}>I want an Agent that can chat</Typography.Title>
      <Typography.Paragraph type="secondary">
        Self-service assembly: declare the capabilities you want, and the portal
        resolves dependencies, previews the change, and upgrades with zero
        downtime.
      </Typography.Paragraph>
      <Button type="primary" size="large" onClick={() => navigate('/wizard?profile=starter')}>
        Start with a Chat Agent
      </Button>
    </Card>
  );
}
