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

const LS_KEY = "aggridCandidateColumnState";
const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#14b8a6"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || "#94a3b8";

/* ── Custom Cell Renderers ── */
const CandidateCellRenderer = ({ value }) => (
  <div className="flex items-center gap-2 h-full">
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0"
      style={{ width: 28, height: 28, background: avatarColor(value), fontSize: 10 }}
    >
      {value?.charAt(0).toUpperCase()}
    </div>
    <span className="font-bold text-slate-800 truncate" style={{ fontSize: 13 }}>{value}</span>
  </div>
);

const RoleCellRenderer = ({ value }) => (
  <div className="flex items-center h-full">
    <span className="text-slate-500 font-semibold" style={{ fontSize: 13 }}>
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
    <Tag color={colors[status] || 'blue'} style={{ borderRadius: '4px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
      {status || 'Active'}
    </Tag>
  );
};

const CandidateTable = forwardRef(({ rowData, onEdit, onDelete, onSelectionChanged, type = 'candidate', isStatTable = false }, ref) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef();

  const isJobType = type === 'job';

  /* ── Restore Column State ── */
  const onGridReady = useCallback((params) => {
    gridRef.current = params;
    const saved = localStorage.getItem(LS_KEY);
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
  }, []);

  /* ── Save Column State ── */
  const onColumnChanged = useCallback(() => {
    if (!gridRef.current?.api) return;
    const columnState = gridRef.current.api.getColumnState();
    localStorage.setItem(LS_KEY, JSON.stringify(columnState));
  }, []);

  /* ── Actions Cell Renderer ── */
  const ActionsCellRenderer = useCallback(({ data }) => {
    // Only show Edit if NOT in a stat table and NOT in jobs table
    const showEdit = !isStatTable && !isJobType;

    const items = [];
    if (showEdit) {
      items.push({
        key: "edit",
        icon: <EditOutlined style={{ color: "#6366f1" }} />,
        label: <span style={{ color: "#6366f1", fontWeight: 600 }}>Edit</span>,
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
            icon={<MoreOutlined style={{ fontSize: 18, color: "#64748b" }} />}
          />
        </Dropdown>
      </div>
    );
  }, [onEdit, onDelete, isStatTable, isJobType]);

  const colDefs = useMemo(() => {
    const checkboxCol = {
      headerName: '',
      field: 'checkbox',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: "left",
      lockPinned: true,
      suppressMenu: true,
      cellClass: "flex items-center justify-center"
    };

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
        checkboxCol,
        { field: 'title', headerName: 'Job Title', flex: 1.5, cellStyle: { fontWeight: 600 } },
        { field: 'department', flex: 1 },
        { field: 'location', flex: 1 },
        {
          field: 'status',
          flex: 1,
          cellRenderer: (p) => <StatusBadge status={p.value} />
        },
        actionsCol
      ];
    }

    let cols = [
      checkboxCol,
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
        field: "skills",
        headerName: "Skills",
        minWidth: 220,
        flex: 1.5,
        cellRenderer: (p) => {
          const skills = p.data.skills || [];
          if (skills.length === 0) return <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>;

          const displaySkills = skills.slice(0, 3);
          const extraCount = skills.length - 3;

          return (
            <div className="flex items-center gap-1 flex-wrap h-full">
              {displaySkills.map(s => (
                <Tag key={s} color="blue" style={{ fontSize: '10px', borderRadius: '4px', margin: 0, fontWeight: 600 }}>{s}</Tag>
              ))}
              {extraCount > 0 && (
                <Dropdown
                  trigger={['click']}
                  placement="bottom"
                  dropdownRender={() => (
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
                    className="cursor-pointer hover:bg-indigo-100 transition-colors"
                    color="indigo"
                    style={{ fontSize: '10px', borderRadius: '4px', margin: 0, fontWeight: 800, background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe' }}
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

  return (
    <div className="w-full">
      <div className="ag-theme-alpine w-full">
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            cellStyle: { textAlign: 'left', display: 'flex', alignItems: 'center' },
            sortable: true,
            filter: false,
            resizable: true,
            suppressMenu: true,
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
          rowSelection='multiple'
          rowMultiSelectWithClick={false}
          suppressRowClickSelection={true}
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

      <style>{`
        .ag-header-cell-label {
          justify-content: flex-start !important;
        }
        .ag-header-cell-text {
          color: black !important;
          font-weight: 600 !important;
          font-size: 13px !important;
        }
        .ag-cell {
          border-right: 1px solid #f1f5f9 !important;
        }
        .ag-row {
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .ag-selection-checkbox {
          margin-right: 12px !important;
        }
      `}</style>
    </div>
  );
});

export default CandidateTable;
