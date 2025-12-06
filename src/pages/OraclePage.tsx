import { MainLayout } from '@/components/layout/MainLayout';
import { OraclePanel } from '@/components/betting/OraclePanel';

export default function OraclePage() {
  return (
    <MainLayout 
      title="Oracle Settlement" 
      subtitle="Admin panel for race result submission"
    >
      <div className="max-w-3xl">
        <OraclePanel />
      </div>
    </MainLayout>
  );
}
