import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { UserList } from '../components/tasks';
import { useGetTeamListsQuery } from '../redux/slices/api/userApiSlice';
import { useCreateTaskMutation } from '../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';

const initialState = {
  title: '',
  description: '',
  stage: '',
  priority: '',
  dueDate: '',
  team: [],
};

const stages = [
  { value: '', label: 'Aşama seçin' },
  { value: 'todo', label: 'To Do' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const priorities = [
  { value: '', label: 'Öncelik seçin' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
];

const CreateTask = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();

  // Kullanıcıları çek (Team için)
  const { data: users, isLoading: loadingUsers } = useGetTeamListsQuery({ search: '' });

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Başlık zorunlu';
    if (!form.description) newErrors.description = 'Açıklama zorunlu';
    if (!form.stage) newErrors.stage = 'Aşama seçilmeli';
    if (!form.priority) newErrors.priority = 'Öncelik seçilmeli';
    if (!form.dueDate) newErrors.dueDate = 'Son tarih zorunlu';
    if (!form.team || form.team.length === 0) newErrors.team = 'En az bir ekip üyesi seçilmeli';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // UserList bileşeninden seçilen kullanıcıların _id'leri alınır
  const handleTeamChange = (teamIds) => {
    setForm({ ...form, team: teamIds });
    setErrors({ ...errors, team: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSubmitted(true);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await createTask({
          title: form.title,
          description: form.description,
          stage: form.stage,
          priority: form.priority,
          date: form.dueDate,
          team: form.team,
        }).unwrap();
        toast.success('Görev başarıyla oluşturuldu!');
        setForm(initialState);
        setSubmitted(false);
      } catch (err) {
        toast.error(err?.data?.message || 'Görev oluşturulamadı!');
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Görev Oluşturma Sayfası</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded shadow p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {submitted && errors.title && <span className="text-red-600 text-xs">{errors.title}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
          {submitted && errors.description && <span className="text-red-600 text-xs">{errors.description}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aşama</label>
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {stages.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {submitted && errors.stage && <span className="text-red-600 text-xs">{errors.stage}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {submitted && errors.priority && <span className="text-red-600 text-xs">{errors.priority}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Son Tarih</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {submitted && errors.dueDate && <span className="text-red-600 text-xs">{errors.dueDate}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Takım Üyeleri</label>
          <UserList team={form.team} setTeam={handleTeamChange} />
          {loadingUsers && <span className="text-gray-500 text-xs">Yükleniyor...</span>}
          {submitted && errors.team && <span className="text-red-600 text-xs">{errors.team}</span>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={creating}
        >
          {creating ? 'Oluşturuluyor...' : 'Oluştur'}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;