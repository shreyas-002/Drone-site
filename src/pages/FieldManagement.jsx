import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Edit } from "lucide-react";
import "../styles/FieldManagement.css";

const FieldManagement = () => {
  const { t } = useTranslation();
  const { user, addField, updateField, deleteField } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cropType: "",
    area: "",
  });
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setFormData({ name: "", cropType: "", area: "" });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.cropType || !formData.area) {
      setMessage("कृपया सभी फील्ड भरें");
      return;
    }

    if (editingId) {
      updateField(editingId, formData);
      setMessage("खेत सफलतापूर्वक अपडेट हुआ!");
    } else {
      addField(formData);
      setMessage("खेत सफलतापूर्वक जोड़ा गया!");
    }

    resetForm();
    setShowForm(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (field) => {
    setFormData({
      name: field.name,
      cropType: field.cropType,
      area: field.area,
    });
    setEditingId(field.id);
    setShowForm(true);
  };

  const handleDelete = (fieldId) => {
    if (window.confirm(t("confirm_delete"))) {
      deleteField(fieldId);
      setMessage("खेत सफलतापूर्वक हटाया गया!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="field-management-container">
      <div className="management-header">
        <h1>{t("farmer_data")}</h1>
        <p>अपने सभी खेतों की जानकारी यहाँ प्रबंधित करें</p>
      </div>

      {message && <div className="success-message">{message}</div>}

      {!showForm && (
        <button
          className="add-field-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={20} />
          {t("add_field")}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="field-form">
          <h2>{editingId ? "खेत संपादित करें" : t("add_field")}</h2>

          <div className="form-group">
            <label htmlFor="name">{t("field_name")}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="जैसे: उत्तरी खेत"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cropType">{t("crop_type")}</label>
            <input
              type="text"
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              placeholder="जैसे: गेहूँ, चावल, मकई"
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">{t("field_area")}</label>
            <input
              type="number"
              id="area"
              name="area"
              step="0.1"
              value={formData.area}
              onChange={handleChange}
              placeholder="0.0"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              {editingId ? "अपडेट करें" : t("add_new")}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {/* Fields List */}
      <div className="fields-list">
        <h2>{t("my_fields")}</h2>
        {user?.fields && user.fields.length > 0 ? (
          <div className="fields-table">
            {user.fields.map((field) => (
              <div key={field.id} className="field-row">
                <div className="field-details">
                  <h3>{field.name}</h3>
                  <p>
                    फसल: <strong>{field.cropType}</strong>
                  </p>
                  <p>
                    क्षेत्र: <strong>{field.area} km²</strong>
                  </p>
                </div>
                <div className="field-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(field)}
                    title={t("edit")}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(field.id)}
                    title={t("delete")}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-fields">
            <p>{t("no_fields")}</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {user?.fields && user.fields.length > 0 && (
        <div className="fields-summary">
          <h3>सारांश</h3>
          <p>कुल खेत: {user.fields.length}</p>
          <p>
            कुल क्षेत्र:{" "}
            {user.fields
              .reduce((sum, field) => sum + (parseFloat(field.area) || 0), 0)
              .toFixed(2)}{" "}
            km²
          </p>
          <p>ड्रोन कवरेज: 2 km² (एक उड़ान में)</p>
        </div>
      )}
    </div>
  );
};

export default FieldManagement;
