import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import EmployeeModal from "./EmployeeModal";
import { useMutation } from "@tanstack/react-query";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import { queryClient } from "../utils/queryClient";

interface Employee {
  id: number;
  email: string;
  name: string;
  age: number;
  role: string;
  salary: number;
}

interface EmployeeProps {
  data?: {
    employee: Employee[];
  };
}

const EmployeeTable = ({ data }: EmployeeProps) => {
  if (data?.employee?.length === 0) {
    return <div>No employee data available</div>;
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error ?? "Failed to delete employee");
      }

      return result;
    },

    onSuccess: () => {
      toast.success("Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="w-full overflow-x-auto px-10">
      <div className="min-w-225 bg-gray-50 rounded-xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Age</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data?.employee?.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className="text-sm text-gray-700 rounded-2xl transition hover:bg-gray-200 hover:rounded-2xl shadow-sm"
                  >
                    <td className="p-4">{item.id}</td>
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.age}</td>
                    <td className="p-4">{item.role}</td>
                    <td className="p-4">{item.salary}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <EmployeeModal data={item} type="update">
                          <button className="bg-gray-200 p-2 rounded-full text-lg transition hover:bg-white cursor-pointer">
                            <TiEdit />
                          </button>
                        </EmployeeModal>
                        <button
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="bg-gray-200 p-2 text-red-600 rounded-full text-lg transition hover:bg-white cursor-pointer"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
