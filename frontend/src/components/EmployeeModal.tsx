import { useState } from "react";
import { backendUrl } from "../App";
import { queryClient } from "../utils/queryClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

//Types
interface EmployeeInfo {
  name: string;
  email: string;
  age: string;
  role: string;
  salary: string;
}
interface EmployeeInfoWithId extends EmployeeInfo {
  id: string | number;
}
interface EmployeeModalProps {
  type: "add" | "update";
  data?: EmployeeInfoWithId;
  children: React.ReactNode;
}

//Field config
const FIELDS: { label: string; name: keyof EmployeeInfo; type?: string }[] = [
  { label: "Name", name: "name" },
  { label: "Email", name: "email" },
  { label: "Age", name: "age", type: "number" }, // FIX: was `type:number` (not a string)
  { label: "Salary", name: "salary" },
];

// Component
const EmployeeModal = ({ type, data, children }: EmployeeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [info, setInfo] = useState<EmployeeInfo>(
    type === "add"
      ? { name: "", email: "", age: "", role: "", salary: "" }
      : {
          name: data?.name ?? "",
          email: data?.email ?? "",
          age: data?.age ?? "",
          role: data?.role ?? "",
          salary: data?.salary ?? "",
        },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addMutation = useMutation({
    mutationFn: async (payload: EmployeeInfo) => {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Employee added successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
      setInfo({ name: "", email: "", age: "", role: "", salary: "" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: EmployeeInfoWithId) => {
      const res = await fetch(`${backendUrl}/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error); // FIX: was `res.error` (should be `result.error`) + must throw
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Employee updated successfully.");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFormSubmission = () => {
    if (type === "add") {
      addMutation.mutate(info);
    } else {
      if (!data?.id) return;
      updateMutation.mutate({ ...info, id: data.id });
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div
        className="inline-block mb-5 float-right md:mr-10 mr-2"
        onClick={() => setIsOpen(true)}
      >
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            // onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 flex justify-center items-center"
          >
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-gray-200 p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-semibold text-lg text-gray-700">
                  {type === "add" ? "Add Employee" : "Update Employee"}
                </h2>
                <button
                  className="font-semibold hover:text-gray-400 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* Text fields */}
              {FIELDS.map((field) => (
                <div key={field.name} className="space-y-4">
                  <label className="block text-sm text-gray-600 my-3 ml-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type ?? "text"}
                    name={field.name}
                    value={info[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm text-gray-600 my-3 ml-2">
                  Role
                </label>
                <select
                  value={info.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setInfo((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="outline-none bg-gray-50 w-full rounded-2xl py-2 px-4 "
                >
                  <option value="">Select Role</option>
                  <option value="HR">HR</option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end item-center gap-5 pt-10 ">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="bg-blue-500 py-1 px-5 text-white font-semibold rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmission}
                  disabled={isPending}
                  className="bg-blue-500 py-1 px-5 text-white font-semibold rounded-2xl cursor-pointer"
                >
                  {isPending ? "Saving…" : type === "add" ? "Add" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeModal;
