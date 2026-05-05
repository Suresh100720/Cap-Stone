import React from 'react';
import { Collapse, Typography } from 'antd';

const { Panel } = Collapse;
const { Text } = Typography;

const PromptDebugger = ({ systemPrompt, userPrompt, rawResponse }) => {
  return (
    <div className="bg-[#f8fafc] rounded-[18px] border border-[#e2e8f0] overflow-hidden shadow-sm">
      <div className="p-3 px-5 bg-white border-b border-[#e2e8f0]">
        <Text className="!text-[#64748b] !text-[11px] !font-extrabold !uppercase !tracking-[1px] block">
          Prompt Debugger
        </Text>
      </div>
      <Collapse ghost accordion className="custom-collapse">
        <Panel 
          header={<span className="text-[#1e293b] text-[13px] font-semibold">System Prompt</span>} 
          key="1"
        >
          <pre className="text-slate-600 bg-white p-4 rounded-xl text-[12px] whitespace-pre-wrap border border-[#e2e8f0] max-h-[300px] overflow-y-auto">
            {systemPrompt}
          </pre>
        </Panel>
        <Panel 
          header={<span className="text-[#1e293b] text-[13px] font-semibold">User Prompt (Payload)</span>} 
          key="2"
        >
          <pre className="text-slate-600 bg-white p-4 rounded-xl text-[12px] whitespace-pre-wrap border border-[#e2e8f0] max-h-[300px] overflow-y-auto">
            {userPrompt}
          </pre>
        </Panel>
        <Panel 
          header={<span className="text-[#1e293b] text-[13px] font-semibold">Raw AI Response</span>} 
          key="3"
        >
          <pre className="text-slate-600 bg-white p-4 rounded-xl text-[12px] whitespace-pre-wrap border border-[#e2e8f0] max-h-[300px] overflow-y-auto">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </Panel>
      </Collapse>
    </div>
  );
};

export default PromptDebugger;
