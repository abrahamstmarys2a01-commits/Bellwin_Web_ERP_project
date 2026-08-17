import { useState, useEffect } from 'react';
import { Edit3, Trash2, Search, Key, X } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/ui/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import DataTable from '../../../components/ui/DataTable';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { TD, TR } from '../../../components/ui/Table';

const LockerMaster = () => {
  const [lockers, setLockers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form states
  const [editingLocker, setEditingLocker] = useState(null);
  const [formData, setFormData] = useState({
    lockerName: '', // UI Label: Locker ID
    address: '',    // UI Label: Branch Name
    status: 'Active'
  });

  // Delete dialog state
  const [deleteId, setDeleteId] = useState(null);

  // Fetch lockers
  const fetchLockers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/loan-config/locker');
      setLockers(res.data.lockers || res.data || []);
    } catch (err) {
      console.error('Failed to fetch lockers', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch branches
  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches');
      if (res.data && res.data.success) {
        setBranches(res.data.data || []);
      } else {
        setBranches(res.data.branches || res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch branches', err);
      // Fallback
      setBranches([
        { _id: '1', branchName: 'TRICHY' },
        { _id: '2', branchName: 'PUDUKKOTTAI' },
        { _id: '3', branchName: 'THANJAVUR' }
      ]);
    }
  };

  useEffect(() => {
    fetchLockers();
    fetchBranches();
  }, []);

  const handleOpenEdit = (locker) => {
    setEditingLocker(locker);
    setFormData({
      lockerName: locker.lockerName || '',
      address: locker.address || '',
      status: locker.status || 'Active'
    });
  };

  const handleClear = () => {
    setEditingLocker(null);
    setFormData({
      lockerName: '',
      address: '',
      status: 'Active'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.lockerName) return toast.error('Locker ID is required');
    if (!formData.address) return toast.error('Branch Name is required');

    setLoading(true);
    try {
      if (editingLocker) {
        await api.put(`/loan-config/locker/${editingLocker._id}`, formData);
        toast.success('Locker updated successfully');
      } else {
        await api.post('/loan-config/locker', formData);
        toast.success('Locker added successfully');
      }
      handleClear();
      fetchLockers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save locker');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await api.delete(`/loan-config/locker/${deleteId}`);
      setDeleteId(null);
      fetchLockers();
      toast.success('Locker deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete locker');
    } finally {
      setLoading(false);
    }
  };

  const filteredLockers = lockers.filter(l =>
    l.lockerName?.toLowerCase().includes(search.toLowerCase()) ||
    l.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      <PageHeader
        title="Locker Master"
        subtitle="Configure and manage physical safe lockers across different branches."
        icon={Key}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
            <span>{editingLocker ? 'Edit Locker Details' : 'Add New Safe Locker'}</span>
            {editingLocker && (
              <button 
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                title="Cancel Edit"
              >
                <X size={18} />
              </button>
            )}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Locker ID"
              required
              value={formData.lockerName}
              onChange={(e) => setFormData({ ...formData, lockerName: e.target.value.toUpperCase() })}
              placeholder="e.g. LKR-001"
            />

            <Select
              label="Branch Name"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            >
              <option value="">Select Branch</option>
              {branches.map(b => (
                <option key={b._id} value={b.branchName}>{b.branchName}</option>
              ))}
            </Select>

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>

            <div className="flex items-center gap-3 pt-2">
              {editingLocker && (
                <Button 
                  type="button" 
                  onClick={handleClear} 
                  variant="secondary"
                  className="w-1/3"
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                className={editingLocker ? "w-2/3" : "w-full"}
              >
                {editingLocker ? 'Update Locker' : 'Save Locker'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Table & Search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Locker ID or Branch..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <DataTable
              headers={[
                'Locker ID',
                'Branch Name',
                'Status',
                'Actions'
              ]}
              data={filteredLockers}
              loading={loading}
              renderRow={(locker) => (
                <TR key={locker._id}>
                  <TD className="font-bold text-gray-800">{locker.lockerName}</TD>
                  <TD>{locker.address}</TD>
                  <TD>
                    <Badge variant={locker.status === 'Active' ? 'success' : 'danger'}>
                      {locker.status}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(locker)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          editingLocker?._id === locker._id 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title="Edit Locker"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(locker._id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete Locker"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </TD>
                </TR>
              )}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Locker Record"
        description="Are you sure you want to delete this locker record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default LockerMaster;
