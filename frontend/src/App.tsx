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

  console.log(data);

  return (
    <>
      <h1 className="text-xl font-semibold text-center mt-20">
        Employee Management System
      </h1>
      <EmployeeModal />
      <EmployeeTable data={data} />
    </>
  );
}

export default App;
