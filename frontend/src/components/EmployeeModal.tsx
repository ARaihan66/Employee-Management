import { useState } from "react";
import { backendUrl } from "../App";
import { queryClient } from "../utils/queryClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EmployeeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [info, setInfo] = useState(
    type === "add"
      ? { name: "", email: "", age: "", role: "", salary: "" }
      : data,
  );

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.name]: [e.target.value],
    }));
  };

  const addMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res;

      if (!res.ok) {
        return new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Employee added successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number, payload) => {
      const res = await fetch(`${backendUrl}/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        return new Error(res.error);
      }

      return result;
    },
  });

  return <div>EmployeeModal</div>;
};

export default EmployeeModal;
