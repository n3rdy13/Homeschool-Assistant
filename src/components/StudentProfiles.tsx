import React, { useState } from "react";
import { Student } from "../types";
import { createStudent } from "../lib/db";
import { Plus, User, Award, BookOpen, ChevronRight, UserCircle } from "lucide-react";

interface StudentProfilesProps {
  students: Student[];
  activeStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onRefresh: () => void;
}

export default function StudentProfiles({
  students,
  activeStudent,
  onSelectStudent,
  onRefresh,
}: StudentProfilesProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Grade 5");
  const [loading, setLoading] = useState(false);

  // Lists of sample options
  const gradeLevels = Array.from({ length: 10 }, (_, i) => `Grade ${i + 3}`); // Grade 3 to Grade 12

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const newStudent = await createStudent(name.trim(), gradeLevel);
      setName("");
      setShowAddForm(false);
      onRefresh();
      onSelectStudent(newStudent);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs" id="student-profiles-module">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900">Student Profiles</h2>
          <p className="text-sm text-gray-500">Select or manage active children profiles</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition duration-150 shadow-xs"
          id="btn-add-student"
        >
          <Plus className="w-4 h-4" />
          <span>Add Profile</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Child's Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Emily Richardson"
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Grade / Academic Year
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150"
              >
                {gradeLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition duration-150 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Save Profile"}
            </button>
          </div>
        </form>
      )}

      {students.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">No student profiles found</p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Get started by adding a profile for your homeschool student to design adaptive plans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {students.map((student) => {
            const isActive = activeStudent?.id === student.id;
            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className={`group relative p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                }`}
                id={`student-card-${student.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isActive ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500Group"}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        <span>{student.gradeLevel}</span>
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-indigo-100 text-indigo-800">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100/80 flex justify-between items-center text-xs text-gray-500">
                  <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
