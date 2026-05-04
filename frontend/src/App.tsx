import { useQuery } from "@tanstack/react-query";
import EmployeeModal from "./components/EmployeeModal";
import EmployeeTable from "./components/EmployeeTable";

export const backendUrl = "http://localhost:5000/api/employee";

function App() {
  async function fetchEmployeeDetails() {
    const res = await fetch(backendUrl);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    return data;
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["employee_details"],
    queryFn: fetchEmployeeDetails,
  });

  if (isPending) {
    return <div>Loading....</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-center mt-20">
        Employee Management System
      </h1>
      <EmployeeModal type="add">
        <button className="px-5 py-2 rounded-2xl bg-gray-300 cursor-pointer">
          Add Employee
        </button>
      </EmployeeModal>
      <EmployeeTable data={data} />
    </>
  );
}

export default App;
