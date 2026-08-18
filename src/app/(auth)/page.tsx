import Header from "@/components/shared/header";

export default function Home() {
  return (
    <>
      <Header>
        <h2 className="font-semibold">Active Todos</h2>
        <p className="text-xs text-gray-600">Manage your pending tasks and todos.</p>
      </Header>
      <p>Todo List Page</p>
    </>
  );
}
