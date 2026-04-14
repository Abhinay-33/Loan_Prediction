import React, { useState } from 'react';

const LoanForm = () => {
  const [formData, setFormData] = useState({
    no_of_dependents: '0',
    education: 'Graduate',
    self_employed: 'No',
    income_annum: '',
    loan_amount: '',
    loan_term: '',
    cibil_score: '',
    residential_assets_value: '',
    commercial_assets_value: '',
    luxury_assets_value: '',
    bank_asset_value: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mapping and Data Conversion to match your trained model
    const payload = {
      no_of_dependents: parseInt(formData.no_of_dependents),
      education: formData.education === 'Graduate' ? 0 : 1,
      self_employed: formData.self_employed === 'Yes' ? 1 : 0,
      income_annum: parseInt(formData.income_annum),
      loan_amount: parseInt(formData.loan_amount),
      loan_term: parseInt(formData.loan_term),
      cibil_score: parseInt(formData.cibil_score),
      residential_assets_value: parseInt(formData.residential_assets_value),
      commercial_assets_value: parseInt(formData.commercial_assets_value),
      luxury_assets_value: parseInt(formData.luxury_assets_value),
      bank_asset_value: parseInt(formData.bank_asset_value),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Backend error');

      const result = await response.json();
      setPrediction(result.status);
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Could not connect to the FastAPI server. Please ensure it is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xlrounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4 mb-6">
          Loan Approval Prediction
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PERSONAL & BASIC INFO */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">No. of Dependents</label>
            <input type="number" name="no_of_dependents" value={formData.no_of_dependents} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Education</label>
            <select name="education" value={formData.education} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300">
              <option value="Graduate">Graduate</option>
              <option value="Not Graduate">Not Graduate</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Self Employed</label>
            <select name="self_employed" value={formData.self_employed} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* FINANCIAL INFO */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Annual Income</label>
            <input type="number" name="income_annum" value={formData.income_annum} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Loan Amount</label>
            <input type="number" name="loan_amount" value={formData.loan_amount} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Loan Term (Months)</label>
            <input type="number" name="loan_term" value={formData.loan_term} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">CIBIL Score (300-900)</label>
            <input type="number" name="cibil_score" value={formData.cibil_score} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          {/* ASSET VALUES */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Residential Assets Value</label>
            <input type="number" name="residential_assets_value" value={formData.residential_assets_value} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Commercial Assets Value</label>
            <input type="number" name="commercial_assets_value" value={formData.commercial_assets_value} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Luxury Assets Value</label>
            <input type="number" name="luxury_assets_value" value={formData.luxury_assets_value} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Bank Asset Value</label>
            <input type="number" name="bank_asset_value" value={formData.bank_asset_value} onChange={handleChange} className="border p-2 rounded mt-1 border-gray-300" required />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`md:col-span-2 lg:col-span-3 font-bold py-3 rounded-lg transition text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? 'Analyzing Application...' : 'Check Eligibility'}
          </button>
        </form>

        {prediction && (
          <div className={`mt-8 p-6 rounded-lg text-center font-bold text-2xl animate-bounce ${prediction === 'Approved' ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-red-100 text-red-700 border-2 border-red-500'}`}>
            Application Status: {prediction}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanForm;