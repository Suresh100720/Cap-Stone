import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Tag, Button, Dropdown, Avatar, Space, Tooltip, Typography, message, Modal, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FilePdfOutlined,
  PlusOutlined,
  FileExcelOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const LS_KEY_PREFIX = "aggridTableState_";
const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#14b8a6"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || "#94a3b8";

/* ── Custom Cell Renderers ── */
const CandidateCellRenderer = ({ value }) => (
  <div className="flex items-center gap-2 h-full">
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 text-[10px] w-7 h-7"
      style={{ background: avatarColor(value) }}
    >
      {value?.charAt(0).toUpperCase()}
    </div>
    <span className="font-bold text-slate-800 truncate text-[13px]">{value}</span>
  </div>
);

const RoleCellRenderer = ({ value }) => (
  <div className="flex items-center h-full">
    <span className="text-slate-500 font-semibold text-[13px]">
      {value || "N/A"}
    </span>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    // Candidate Statuses
    Active: 'green',
    Inactive: 'default',
    Hired: 'green',
    Interview: 'purple',
    Screening: 'orange',
    Rejected: 'red',
    Applied: 'blue',
    // Job Statuses
    Open: 'green',
    Closed: 'red',
    'Actively Hiring': 'blue',
    'On Hold': 'orange'
  };
  return (
    <Tag 
      color={colors[status] || 'blue'} 
      className="!rounded-[4px] font-semibold text-[11px] uppercase"
    >
      {status || 'Active'}
    </Tag>
  );
};

const CandidateTable = forwardRef(({ rowData, onEdit, onDelete, onSelectionChanged, type = 'candidate', isStatTable = false }, ref) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef();

  const isJobType = type === 'job';

  const lsKey = LS_KEY_PREFIX + type;

  /* ── Restore Column State ── */
  const onGridReady = useCallback((params) => {
    gridRef.current = params;
    const saved = localStorage.getItem(lsKey);
    if (saved && params.api) {
      try {
        const columnState = JSON.parse(saved);
        params.api.applyColumnState({ state: columnState, applyOrder: true });
      } catch (err) {
        console.error("Failed to restore column state:", err);
      }
    } else if (params.api) {
      params.api.sizeColumnsToFit();
    }
  }, [lsKey]);

  /* ── Save Column State ── */
  const onColumnChanged = useCallback(() => {
    if (!gridRef.current?.api) return;
    const columnState = gridRef.current.api.getColumnState();
    localStorage.setItem(lsKey, JSON.stringify(columnState));
  }, [lsKey]);

  /* ── Actions Cell Renderer ── */
  const ActionsCellRenderer = useCallback(({ data }) => {
    // Only show Edit if NOT in a stat table and NOT in jobs table
    const showEdit = !isStatTable && !isJobType;

    const items = [];
    if (showEdit) {
      items.push({
        key: "edit",
        icon: <EditOutlined className="text-[#6366f1]" />,
        label: <span className="text-[#6366f1] font-semibold">Edit</span>,
        onClick: () => onEdit && onEdit(data),
      });
      items.push({ type: "divider" });
    }

    items.push({
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
      onClick: () => onDelete(data._id || data.id),
    });

    return (
      <div className="flex items-center justify-center h-full">
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined className="text-lg text-slate-500" />}
          />
        </Dropdown>
      </div>
    );
  }, [onEdit, onDelete, isStatTable, isJobType]);

  const colDefs = useMemo(() => {
    // Note: checkboxSelection and headerCheckboxSelection are now configured via the rowSelection prop in AG Grid v32+
    const actionsCol = {
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
      width: 90,
      pinned: "right",
      lockPinned: true,
      sortable: false,
      resizable: false,
      suppressHeaderMenuButton: true,
    };

    if (isJobType) {
      return [
        { 
          field: 'title', 
          headerName: 'Job Title', 
          flex: 1.5, 
          cellClass: "font-semibold text-slate-800",
          minWidth: 180
        },
        { field: 'department', flex: 1, minWidth: 120 },
        { field: 'location', flex: 1, minWidth: 140 },
        {
          field: 'status',
          headerName: 'Status',
          flex: 1,
          minWidth: 120,
          cellRenderer: (p) => <div className="flex items-center h-full"><StatusBadge status={p.value} /></div>
        },
        actionsCol
      ];
    }

    let cols = [
      {
        field: "name",
        headerName: "Name",
        cellRenderer: CandidateCellRenderer,
        minWidth: 160,
        flex: 1.5,
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 200,
        flex: 1.5,
        sortable: true,
      },
      {
        field: "phone",
        headerName: "Contact",
        minWidth: 140,
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        cellRenderer: RoleCellRenderer,
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: "Skills",
        minWidth: 220,
        flex: 1.5,
        valueFormatter: (p) => (p.value || []).join(', '),
        cellRenderer: (p) => {
          const skills = p.data.skills || [];
          if (skills.length === 0) return <span className="text-[#cbd5e1] text-[13px]">—</span>;

          const displaySkills = skills.slice(0, 3);
          const extraCount = skills.length - 3;

          return (
            <div className="flex items-center gap-1 flex-wrap h-full">
              {displaySkills.map(s => (
                <Tag 
                  key={s} 
                  color="blue" 
                  className="!text-[10px] !rounded-[4px] !m-0 font-semibold"
                >
                  {s}
                </Tag>
              ))}
              {extraCount > 0 && (
                <Dropdown
                  trigger={['click']}
                  placement="bottom"
                  popupRender={() => (
                    <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 max-w-[280px] flex flex-wrap gap-1.5">
                      <div className="w-full mb-1 pb-1 border-b border-slate-100">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-tight">Full Skill Set</span>
                      </div>
                      {skills.map(s => (
                        <Tag key={s} color="blue" className="rounded-md font-semibold m-0">{s}</Tag>
                      ))}
                    </div>
                  )}
                >
                  <Tag
                    className="cursor-pointer hover:bg-indigo-100 transition-colors !text-[10px] !rounded-[4px] !m-0 font-extrabold !bg-[#e0e7ff] !text-[#4338ca] !border-[#c7d2fe]"
                    color="indigo"
                  >
                    +{extraCount}
                  </Tag>
                </Dropdown>
              )}
            </div>
          );
        }
      },
      {
        field: "status",
        headerName: "Status",
        cellRenderer: (p) => <div className="flex items-center h-full"><StatusBadge status={p.value} /></div>,
        minWidth: 120,
        flex: 1,
      },
      actionsCol,
    ];

    return cols;
  }, [isJobType, ActionsCellRenderer]);

  const handleGridSelectionChanged = useCallback((event) => {
    const selected = event.api.getSelectedRows();
    setSelectedRows(selected);
    if (onSelectionChanged) onSelectionChanged(event);
  }, [onSelectionChanged]);

  const rowSelection = useMemo(() => ({
    mode: 'multiRow',
    headerCheckbox: true,
    checkboxes: true,
    enableClickSelection: false,
    enableSelectionWithoutKeys: true
  }), []);

  return (
    <div className="w-full">
      <div className="w-full">
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            cellClass: "flex items-center justify-start",
            sortable: true,
            filter: false,
            resizable: true,
            suppressHeaderMenuButton: true
          }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          domLayout='autoHeight'
          onGridReady={onGridReady}
          onColumnMoved={onColumnChanged}
          onColumnResized={onColumnChanged}
          onColumnVisible={onColumnChanged}
          onSelectionChanged={handleGridSelectionChanged}
          rowSelection={rowSelection}
          rowHeight={52}
          headerHeight={48}
          sideBar={{
            toolPanels: [
              {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                  suppressRowGroups: true,
                  suppressValues: true,
                  suppressPivots: true,
                  suppressPivotMode: true
                }
              }
            ]
          }}
        />
      </div>
    </div>
  );
});

export default CandidateTable;
