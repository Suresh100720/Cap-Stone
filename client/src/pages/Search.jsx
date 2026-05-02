import React, { useState, useRef } from 'react';
import { 
  Input, 
  Card, 
  List, 
  Tag, 
  Space, 
  Empty, 
  Spin, 
  Avatar, 
  Typography, 
  Button,
  Select,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  ThunderboltOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { searchCandidates } from '../services/searchService';

const { Title, Text, Paragraph } = Typography;

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({ experience: [], skills: [], roles: [] });
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);

  const onSearch = async (queryParam = '', currentFilters = filters) => {
    setLoading(true);
    try {
      const data = await searchCandidates(queryParam, false, currentFilters);
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(val, filters);
    }, 500);
  };

  const clearFilters = () => {
    setFilters({ experience: [], skills: [], roles: [] });
    setQuery('');
    setResults([]);
  };

  const roleOptions = [
    'Software Engineer', 'Fullstack Developer', 'Frontend Developer', 'Backend Developer', 
    'UI/UX Designer', 'DevOps Engineer', 'Data Scientist', 'Project Manager', 'QA Engineer'
  ].map(r => ({ value: r, label: r }));

  const skillOptions = [
    'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'MongoDB', 'SQL', 'Docker', 'Java', 'Next.js'
  ].map(s => ({ value: s, label: s }));

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
  };

  return (
    <div style={{ paddingBottom: 40, background: '#fafafa', minHeight: 'calc(100vh - 64px)', margin: '-24px', padding: '24px' }}>
      
      {/* Premium Command Bar */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: '#ffffff', 
        padding: '24px', 
        borderRadius: 24,
        marginBottom: 32, 
        border: '1px solid #f1f5f9', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {/* Main Search Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Input 
              placeholder="Search talent pool by name, skills, or background..." 
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              suffix={
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={() => onSearch(query, filters)}
                  style={{ 
                    background: '#7c3aed', 
                    border: 'none', 
                    borderRadius: 12, 
                    width: 44, 
                    height: 40,
                    marginRight: -4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
                  }} 
                />
              }
              style={{ 
                height: 56, 
                borderRadius: 20, 
                border: '1px solid #e2e8f0', 
                fontSize: 16, 
                fontWeight: 500,
                background: '#f8fafc',
                paddingLeft: 20,
                paddingRight: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            />
          </div>
          <Button type="text" onClick={clearFilters} style={{ color: '#64748b', fontWeight: 600, height: 56 }}>Reset Filters</Button>
        </div>

        {/* Filter Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
          {/* Roles Filter */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            background: '#f5f3ff', 
            padding: '4px 16px 4px 12px', 
            borderRadius: 14, 
            border: '1px solid #ddd6fe' 
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#7c3aed', letterSpacing: '0.1em' }}>ROLES</span>
            <Select
              mode="multiple"
              placeholder="All Specializations"
              style={{ minWidth: 200 }}
              bordered={false}
              value={filters.roles}
              onChange={(vals) => {
                const nf = { ...filters, roles: vals };
                setFilters(nf);
                onSearch(query, nf);
              }}
              maxTagCount="responsive"
              className="custom-select-premium roles-select"
              options={roleOptions}
            />
          </div>

          {/* Skills Filter */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            background: '#f0f9ff', 
            padding: '4px 16px 4px 12px', 
            borderRadius: 14, 
            border: '1px solid #bae6fd' 
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#0ea5e9', letterSpacing: '0.1em' }}>SKILLS</span>
            <Select
              mode="multiple"
              placeholder="Filter by Skills"
              style={{ minWidth: 200 }}
              bordered={false}
              value={filters.skills}
              onChange={(vals) => {
                const nf = { ...filters, skills: vals };
                setFilters(nf);
                onSearch(query, nf);
              }}
              maxTagCount="responsive"
              className="custom-select-premium skills-select"
              options={skillOptions}
            />
          </div>

          {/* Experience Filter */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            background: '#f0fdfa', 
            padding: '4px 16px 4px 12px', 
            borderRadius: 14, 
            border: '1px solid #99f6e4' 
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#0d9488', letterSpacing: '0.1em' }}>EXPERIENCE</span>
            <Select
              mode="multiple"
              placeholder="Any Experience"
              style={{ minWidth: 180 }}
              bordered={false}
              value={filters.experience}
              onChange={(vals) => {
                const nf = { ...filters, experience: vals };
                setFilters(nf);
                onSearch(query, nf);
              }}
              className="custom-select-premium exp-select"
            >
              <Select.Option value="entry">Junior (0-2y)</Select.Option>
              <Select.Option value="mid">Mid (2-5y)</Select.Option>
              <Select.Option value="senior">Senior (5y+)</Select.Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', marginTop: 100 }}>
            <Spin size="large" />
            <p style={{ color: '#64748b', marginTop: 16, fontSize: 16 }}>Scanning talent pool...</p>
          </div>
        ) : results.length > 0 ? (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 8px' }}>
                <Text style={{ color: '#64748b', fontWeight: 600 }}>Total candidates: <span style={{ color: '#7c3aed' }}>{results.length}</span></Text>
                <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600, padding: '2px 10px' }} icon={<ThunderboltOutlined />}>AI RANKED</Tag>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {results.map((item) => (
                <Card 
                  key={item._id}
                  hoverable 
                  style={{ borderRadius: 24, border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', overflow: 'hidden' }}
                  styles={{ body: { padding: '28px' } }}
                >
                  <div style={{ display: 'flex', gap: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <Avatar 
                          size={80} 
                          style={{ background: '#f5f3ff', color: '#7c3aed', borderRadius: 20, fontSize: 24, fontWeight: 800, border: '2px solid #ddd6fe' }}
                        >
                          {getInitials(item.name)}
                        </Avatar>
                        {item.aiScore > 0 && (
                          <Badge count={`${item.aiScore}% Match`} style={{ background: '#7c3aed', fontWeight: 700, borderRadius: 6 }} />
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <Title level={4} style={{ color: '#1e293b', fontWeight: 800, margin: '0 0 4px 0' }}>{item.name}</Title>
                          <Space size={12} split={<Divider type="vertical" style={{ background: '#e2e8f0' }} />}>
                            <Text style={{ color: '#7c3aed', fontWeight: 700, fontSize: 14 }}>{item.role}</Text>
                            <Text style={{ color: '#64748b', fontWeight: 600 }}>{item.experience} Years Exp.</Text>
                            <Tag color={item.status === 'Hired' ? 'success' : 'processing'} style={{ borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>{item.status}</Tag>
                          </Space>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <Tooltip title={item.email}><Button icon={<MailOutlined style={{ fontSize: 16 }} />} shape="circle" type="text" /></Tooltip>
                            <Tooltip title={item.phone}><Button icon={<PhoneOutlined style={{ fontSize: 16 }} />} shape="circle" type="text" /></Tooltip>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 16 }}>
                        {item.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13 }}>
                            <EnvironmentOutlined style={{ fontSize: 14 }} /> {item.location}
                          </div>
                        )}
                        {item.education && item.education.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13 }}>
                            <ReadOutlined style={{ fontSize: 14 }} /> {item.education[0]}
                          </div>
                        )}
                      </div>
                      
                      {item.summary && (
                        <Paragraph style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }} ellipsis={{ rows: 2 }}>
                          {item.summary}
                        </Paragraph>
                      )}
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(item.skills || []).map(skill => (
                          <Tag key={skill} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 8, fontSize: 11, fontWeight: 600, padding: '2px 8px' }}>
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : query ? (
          <Empty style={{ marginTop: 100 }} description={<Text style={{ color: '#94a3b8', fontSize: 16 }}>No matches found for "{query}"</Text>} />
        ) : (
          <div style={{ padding: '80px 0', textAlign: 'center', background: '#ffffff', borderRadius: 40, border: '1px dashed #e2e8f0', marginTop: 40 }}>
             <SearchOutlined style={{ fontSize: 64, color: '#cbd5e1', marginBottom: 24 }} />
             <Title level={4} style={{ color: '#64748b', fontWeight: 800 }}>Discover Global Talent</Title>
             <Text style={{ color: '#94a3b8', fontSize: 15 }}>Start by typing a name, skill, or selecting roles above.</Text>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .custom-select-premium .ant-select-selector {
          background: transparent !important;
          padding: 0 !important;
          transition: all 0.3s !important;
          border: none !important;
          box-shadow: none !important;
        }
        .ant-select-selection-placeholder {
          font-weight: 700 !important;
          font-size: 13px !important;
          color: #64748b !important;
        }
        .roles-select .ant-select-selection-item { background: #7c3aed !important; color: #fff !important; border-radius: 6px !important; border: none !important; }
        .skills-select .ant-select-selection-item { background: #0ea5e9 !important; color: #fff !important; border-radius: 6px !important; border: none !important; }
        .exp-select .ant-select-selection-item { background: #0d9488 !important; color: #fff !important; border-radius: 6px !important; border: none !important; }
        .ant-select-selection-item-remove { color: #fff !important; opacity: 0.8; }
        .ant-select-selection-item-remove:hover { opacity: 1; }
      `}</style>
    </div>
  );
};

export default Search;
