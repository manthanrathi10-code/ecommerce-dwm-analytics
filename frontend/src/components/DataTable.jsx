import React from 'react';
import { EmptyState } from './StateComponents';
import { FileSpreadsheet } from 'lucide-react';

const DataTable = ({ columns, data, loading, emptyMessage = 'No records found' }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No Records Available" message={emptyMessage} />;
  }

  return (
    <div className="card animate-fade-in" style={styles.card}>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={col.style || {}}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={styles.row}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={col.style || {}}>
                    {col.render ? col.render(row) : (row[col.accessor] !== null && row[col.accessor] !== undefined ? String(row[col.accessor]) : '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: 0,
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-card)'
  },
  row: {
    transition: 'background-color var(--transition-fast)'
  }
};

export default DataTable;
