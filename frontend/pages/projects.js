import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/axios";
import Sidebar from "../../components/Sidebar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";

export default function ProjectsPage() {
  const [molds, setMolds] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMold, setCurrentMold] = useState({});
  const [statuses] = useState([
    { label: "Todos", value: null },
    { label: "Não iniciado", value: "not started" },
    { label: "Em processo", value: "in process" },
    { label: "Pausado", value: "paused" },
    { label: "Completo", value: "completed" }
  ]);
  const router = useRouter();
}