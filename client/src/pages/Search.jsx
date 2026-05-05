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
    <div className="pb-10 bg-[#fafafa] min-h-[calc(100vh-64px)] -m-6 p-6">

      {/* Premium Command Bar */}
      <div className="sticky top-0 z-[100] bg-white p-6 rounded-[24px] mb-8 border border-[#f1f5f9] shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col gap-5">
        {/* Main Search Row */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="pool by name, skills, or background..."
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              suffix={
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => onSearch(query, filters)}
                  className="!bg-[#7c3aed] !border-none !rounded-xl !w-11 !h-10 -mr-1 flex items-center justify-center !shadow-[0_4px_12px_rgba(124,58,237,0.2)]"
                />
              }
              className="!text-black !h-14 !rounded-[20px] !border-[#e2e8f0] !text-base !font-medium !bg-[#f8fafc] !pl-5 !pr-2 !shadow-[0_4px_20px_rgba(0,0,0,0.02)] placeholder:text-black placeholder:opacity-100"
            />
          </div>
          <Button type="text" onClick={clearFilters} className="!text-[#64748b] !font-semibold !h-14">Reset Filters</Button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Roles Filter */}
          <div className="flex items-center gap-3 bg-[#f5f3ff] px-4 pl-3 py-1 rounded-[14px] border border-[#ddd6fe]">
            <span className="text-[11px] font-black text-[#7c3aed] tracking-widest uppercase">Roles</span>
            <Select
              mode="multiple"
              placeholder="All Specializations"
              className="min-w-[200px] custom-select-premium roles-select"
              variant="borderless"
              value={filters.roles}
              onChange={(vals) => {
                const nf = { ...filters, roles: vals };
                setFilters(nf);
                onSearch(query, nf);
              }}
              maxTagCount="responsive"
              options={roleOptions}
            />
          </div>

          {/* Skills Filter */}
          <div className="flex items-center gap-3 bg-[#f0f9ff] px-4 pl-3 py-1 rounded-[14px] border border-[#bae6fd]">
            <span className="text-[11px] font-black text-[#0ea5e9] tracking-widest uppercase">Skills</span>
            <Select
              mode="multiple"
              placeholder="Filter by Skills"
              className="min-w-[200px] custom-select-premium skills-select"
              variant="borderless"
              value={filters.skills}
              onChange={(vals) => {
                const nf = { ...filters, skills: vals };
                setFilters(nf);
                onSearch(query, nf);
              }}
              maxTagCount="responsive"
              options={skillOptions}
            />
          </div>

          {/* Experience Filter */}
          <div className="flex items-center gap-3 bg-[#f0fdfa] px-4 pl-3 py-1 rounded-[14px] border border-[#99f6e4]">
            <span className="text-[11px] font-black text-[#0d9488] tracking-widest uppercase">Experience</span>
            <Select
              mode="multiple"
              placeholder="Any Experience"
              className="min-w-[180px] custom-select-premium exp-select"
              variant="borderless"
              value={filters.experience}
              onChange={(vals) => {
                const nf = { ...filters, experience: vals };
                setFilters(nf);
                onSearch(query, nf);
              }}
            >
              <Select.Option value="entry">Junior (0-2y)</Select.Option>
              <Select.Option value="mid">Mid (2-5y)</Select.Option>
              <Select.Option value="senior">Senior (5y+)</Select.Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-[1200px] mx-auto">
        {loading ? (
          <div className="py-20 text-center mt-[100px]">
            <Spin size="large" />
            <p className="text-[#64748b] mt-4 text-base">Scanning talent pool...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex justify-between items-center mb-6 px-2">
              <Text className="text-[#64748b] font-semibold">Total candidates: <span className="text-[#7c3aed]">{results.length}</span></Text>
              <Tag color="cyan" className="!rounded-md !font-semibold !px-[10px] !py-0.5" icon={<ThunderboltOutlined />}>AI RANKED</Tag>
            </div>

            <div className="flex flex-col gap-5">
              {results.map((item) => (
                <Card
                  key={item._id}
                  hoverable
                  className="!rounded-[24px] !border-[#f1f5f9] !shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden"
                  styles={{ body: { padding: '28px' } }}
                >
                  <div className="flex gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar
                        size={80}
                        className="!bg-[#f5f3ff] !text-[#7c3aed] !rounded-[20px] !text-2xl !font-extrabold !border-2 !border-[#ddd6fe]"
                      >
                        {getInitials(item.name)}
                      </Avatar>
                      {item.aiScore > 0 && (
                        <Badge count={`${item.aiScore}% Match`} className="!bg-[#7c3aed] !font-bold !rounded-md" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Title level={4} className="!text-[#1e293b] !font-extrabold !m-0 !mb-1">{item.name}</Title>
                          <Space size={12} split={<Divider type="vertical" className="!bg-[#e2e8f0]" />}>
                            <Text className="text-[#7c3aed] font-bold text-sm">{item.role}</Text>
                            <Text className="text-[#64748b] font-semibold">{item.experience} Years Exp.</Text>
                            <Tag color={item.status === 'Hired' ? 'success' : 'processing'} className="!rounded !font-bold !text-[10px] uppercase">{item.status}</Tag>
                          </Space>
                        </div>
                        <div className="flex gap-3">
                          <Tooltip title={item.email}><Button icon={<MailOutlined className="text-base" />} shape="circle" type="text" /></Tooltip>
                          <Tooltip title={item.phone}><Button icon={<PhoneOutlined className="text-base" />} shape="circle" type="text" /></Tooltip>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-5 mb-4">
                        {item.location && (
                          <div className="flex items-center gap-1.5 text-[#94a3b8] text-[13px]">
                            <EnvironmentOutlined className="text-sm" /> {item.location}
                          </div>
                        )}
                        {item.education && item.education.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[#94a3b8] text-[13px]">
                            <ReadOutlined className="text-sm" /> {item.education[0]}
                          </div>
                        )}
                      </div>

                      {item.summary && (
                        <Paragraph className="!text-[#64748b] !text-sm !leading-relaxed mb-4" ellipsis={{ rows: 2 }}>
                          {item.summary}
                        </Paragraph>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {(item.skills || []).map(skill => (
                          <Tag key={skill} className="!bg-white !border-[#e2e8f0] !text-[#64748b] !rounded-lg !text-[11px] !font-semibold !px-2 !py-0.5">
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
          <Empty className="mt-[100px]" description={<Text className="text-[#94a3b8] text-base">No matches found for "{query}"</Text>} />
        ) : (
          <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-[#e2e8f0] mt-10">
            <SearchOutlined className="text-[64px] text-[#cbd5e1] mb-6" />
            <Title level={4} className="!text-[#64748b] !font-extrabold">Discover Global Talent</Title>
            <Text className="text-[#94a3b8] text-[15px]">Start by typing a name, skill, or selecting roles above.</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
