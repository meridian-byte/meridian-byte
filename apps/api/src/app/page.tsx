import { LayoutMain } from '@repo/ui';
import PageHome from '@api/ui/page/home';

export default function Home() {
  return (
    <HomeLayout>
      <PageHome />
    </HomeLayout>
  );
}

async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutMain>
      <div>
        <main>{children}</main>
      </div>
    </LayoutMain>
  );
}
