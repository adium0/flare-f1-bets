import { MainLayout } from '@/components/layout/MainLayout';
import { OraclePanel } from '@/components/betting/OraclePanel';
import { MultiWalletDemo } from '@/components/betting/MultiWalletDemo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OraclePage() {
  return (
    <MainLayout 
      title="Oracle Settlement" 
      subtitle="Admin panel for race result submission and demo tools"
    >
      <div className="max-w-4xl">
        <Tabs defaultValue="oracle" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oracle">Oracle Panel</TabsTrigger>
            <TabsTrigger value="demo">Multi-Wallet Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="oracle" className="space-y-6">
            <OraclePanel />
          </TabsContent>
          
          <TabsContent value="demo" className="space-y-6">
            <MultiWalletDemo />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
