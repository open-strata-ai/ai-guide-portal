import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { TenantSwitcher } from '@openstrata/ai-ui-kit';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomePage } from './features/HomePage';
import { WizardPage } from './features/WizardPage';
import { PlanPage } from './features/PlanPage';
import { ApplyPage } from './features/ApplyPage';
import { StatusPage } from './features/StatusPage';
import { RollbackPage } from './features/RollbackPage';
import { ContractPage } from './features/ContractPage';
import { NotFound } from './features/NotFound';
import { AuthGuard } from './auth/AuthGuard';
import { useSession } from './infrastructure/session';
import type { Tenant } from '@openstrata/ai-ui-kit';

const { Header, Sider, Content } = Layout;

const MENU = [
  { key: '/', label: 'Home' },
  { key: '/wizard', label: 'Wizard' },
  { key: '/plan', label: 'Plan' },
  { key: '/apply', label: 'Apply' },
  { key: '/status', label: 'Status' },
  { key: '/rollback', label: 'Rollback' },
  { key: '/contract', label: 'Engine contract' },
];

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setTenant } = useSession();
  const selected = MENU.find((m) => location.pathname === m.key)?.key ?? '/';

  const tenants: Tenant[] = [
    { id: 'local', name: 'Local (dev)', color: '#1677ff' },
    { id: 'tenant-a', name: 'Tenant A' },
    { id: 'tenant-b', name: 'Tenant B' },
  ];

  return (
    <AuthGuard>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light" breakpoint="lg" collapsible>
          <div style={{ padding: 16, fontWeight: 600 }}>OpenStrata Guide</div>
          <Menu
            mode="inline"
            selectedKeys={[selected]}
            items={MENU}
            onClick={(e) => navigate(e.key)}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 12,
              paddingInline: 16,
            }}
          >
            <Typography.Text type="secondary">assembly portal</Typography.Text>
            <TenantSwitcher
              tenants={tenants}
              value={session.tenantId}
              onChange={(id) => setTenant(id)}
            />
          </Header>
          <Content style={{ padding: 24 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/apply" element={<ApplyPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/rollback" element={<RollbackPage />} />
              <Route path="/contract" element={<ContractPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </AuthGuard>
  );
}
