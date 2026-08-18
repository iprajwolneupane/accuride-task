import { getTodosByUser } from "@/actions/todo";
import Header from "@/components/shared/header";

export default async function Calendar() {
    const todos = await getTodosByUser();

    return (
        <>
            <Header>
                <h2 className="font-semibold">Calendar</h2>
                <p className="text-xs text-gray-600">View your calendar and tasks.</p>
            </Header>
            <p>Calendar Page</p>
        </>
    );
}
