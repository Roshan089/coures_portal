'use client'

import { 
  Paper, 
  FormControl, 
  Select, 
  MenuItem, 
  SelectChangeEvent, 
  Box, 
  Typography,
  useTheme
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { useState } from 'react'
import { useGetCompanyGraphQuery } from '@/store/api/adminDasboardApiSlice'


export function AdminRecruitingGraph() {
  const theme = useTheme()

  const { data: recruitingGraphData, isLoading } = useGetCompanyGraphQuery('agency')
  const chartData =
    recruitingGraphData?.planWiseRevenue.map((item) => ({
      name: item.bundleName,
      value: parseFloat(item.percentage),
    })) || [];
  

  return (
    <Paper 
      elevation={1}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: '16px',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        height: { xs: 400, sm: 430, md: 460 },
        width: '100%'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          justifyContent: 'space-between',
          mb: { xs: 3, sm: 2 }
        }}
      >
        <Box>
          <Typography
            color="#EA7516"
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
            }}
          >
            Total Recruiting
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 }
              }}
            >
              {(recruitingGraphData?.totalAmount || 0).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </Typography>
            
          </Box>
        </Box>
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: { xs: '120px', sm: '100px', md: '120px' },
            maxWidth: { xs: '140px', sm: '120px', md: '140px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '100px',
              borderColor: '#FF8A65',
              
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF8A65',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF8A65',
              },
            },
            '& .MuiSelect-select': {
              padding: { xs: '4px 10px', sm: '6px 12px' },
            }
          }}
        >
          
        </FormControl>
      </Box>

      <Box sx={{ 
        height: { 
          xs: 'calc(100% - 140px)',
          sm: 'calc(100% - 120px)' 
        },
        width: '100%'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ 
              top: 20, 
              right: -25,
              left: -5,
              bottom: 30 
            }}
            barSize={20}
            barGap={100}
            barCategoryGap={100}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B4D8" stopOpacity={1}/>
                <stop offset="95%" stopColor="#00B4D8" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis 
              dataKey="name"
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              angle={-45}
              tick={{ 
                fill: '#94A3B8',
               
                textAnchor: 'end',
                fontSize: 14
              }}
              dy={10}
              height={60}
              interval={0}
              padding={{ left: 30, right: 30 }}
            />
            <YAxis
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              tick={{ 
                fill: '#94A3B8', 
                
              }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2,
                        backgroundColor: '#00B4D8',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 500 }}>
                          {payload[0].value}%
                        </p>
                      </div>
                    </Paper>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey="value" 
              fill="url(#barGradient) "
              radius={[8, 8, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
} 