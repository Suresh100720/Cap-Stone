import React from 'react';
import { Collapse, Typography } from 'antd';

const { Panel } = Collapse;
const { Text } = Typography;

const PromptDebugger = ({ systemPrompt, userPrompt, rawResponse }) => {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <Text style={{ color: '#64748b', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Prompt Debugger
        </Text>
      </div>
      <Collapse ghost>
        <Panel header={<span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>System Prompt</span>} key="1">
          <pre style={{ color: '#475569', background: '#fff', padding: 16, borderRadius: 12, fontSize: '12px', whiteSpace: 'pre-wrap', border: '1px solid #e2e8f0' }}>
            {systemPrompt}
          </pre>
        </Panel>
        <Panel header={<span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>User Prompt (Payload)</span>} key="2">
          <pre style={{ color: '#475569', background: '#fff', padding: 16, borderRadius: 12, fontSize: '12px', whiteSpace: 'pre-wrap', border: '1px solid #e2e8f0' }}>
            {userPrompt}
          </pre>
        </Panel>
        <Panel header={<span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>Raw AI Response</span>} key="3">
          <pre style={{ color: '#475569', background: '#fff', padding: 16, borderRadius: 12, fontSize: '12px', whiteSpace: 'pre-wrap', border: '1px solid #e2e8f0' }}>
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </Panel>
      </Collapse>
    </div>
  );
};

export default PromptDebugger;
