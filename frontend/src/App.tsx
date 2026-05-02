import { useQuery } from "@tanstack/react-query";

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
      <h1>Hello World</h1>
    </>
  );
}

export default App;
