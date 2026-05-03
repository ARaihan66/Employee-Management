import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

const EmployeeTable = ({ data }) => {
  return (
    <div className="mx-32">
      <table className="w-full">
        <thead>
          <tr className="border py-4">
            <th className="border px-2">ID</th>
            <th className="border px-2">Email</th>
            <th className="border px-2">Name</th>
            <th className="border px-2">Age</th>
            <th className="border px-2">Role</th>
            <th className="border px-2">Salary</th>
            <th className="border px-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.employee?.map((item) => {
              return (
                <tr key={item.id} className="border text-center">
                  <td className="border px-2 py-4">{item.id}</td>
                  <td className="border px-2">{item.email}</td>
                  <td className="border px-2">{item.name}</td>
                  <td className="border px-2">{item.age}</td>
                  <td className="border px-2">{item.role}</td>
                  <td className="border px-2">{item.salary}</td>
                  <td className="border px-2">
                    <div className="flex justify-center gap-5">
                      <button>
                        <TiEdit className="text-xl" />
                      </button>
                      <button>
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
