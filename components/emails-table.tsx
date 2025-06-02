import type React from "react"

interface EmailsTableProps {
  isDetailView?: boolean
}

export const EmailsTable: React.FC<EmailsTableProps> = ({ isDetailView = false }) => {
  return (
    <div>
      {!isDetailView && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div>Emails</div>
          <div>
            {/* View Buttons (Grid, List, Table) */}
            <button>Grid</button>
            <button>List</button>
            <button>Table</button>
          </div>
          <div>
            <button>Add email</button>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Meeting Reminder</td>
            <td>john.doe@example.com</td>
            <td>jane.smith@example.com</td>
            <td>2023-10-26</td>
          </tr>
          <tr>
            <td>Project Update</td>
            <td>jane.smith@example.com</td>
            <td>team@example.com</td>
            <td>2023-10-25</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
