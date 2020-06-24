import React, { FC } from 'react'
import { VictoryChart, VictoryVoronoiContainer, VictoryGroup, VictoryTooltip, VictoryLine, VictoryScatter, VictoryAxis } from 'victory-native'

import { DateUtil } from '../../utils'

interface PageProp {
  data: Array<{ x: any, y: any }>
  color?: string
  showSymbol?: boolean
  yLabel?: string
}

const LineGraph: FC<PageProp> = ({ data, color = 'tomato', showSymbol, yLabel }) => {
  return (
    <VictoryChart
      style={ {

      } }
      animate={ { duration: 2000 } }
      height={ 250 }
      width={ 325 }
      minDomain={ { y: 0 } }
      scale={ { x: data[ 0 ]?.x instanceof Date ? "time" : 'linear' } }
      padding={ { top: 30, left: 50, right: 30, bottom: 50 } }
      domainPadding={ { y: 5 } }
      containerComponent={
        <VictoryVoronoiContainer />
      }
    >
      <VictoryAxis dependentAxis
        tickValues={ data.map(d => d.y) }
        tickFormat={ y => y.toPrecision(3) }
      />
      <VictoryAxis
        tickValues={ data.map(d => d.x) }
        tickFormat={ x => DateUtil.day[ x.getDay() ] + '\n' + x.getDate() }
      />
      <VictoryGroup
        style={ {
          data: { stroke: color }
        } }
        data={ data }
        labels={ ({ datum }) => (yLabel ? yLabel + ': ' : '') + datum.y }
        labelComponent={
          <VictoryTooltip
            style={ { fill: color, fontSize: '12px' } }
            flyoutStyle={ { stroke: color, strokeWidth: 1 } }
            renderInPortal={ false }
          />
        }
      >
        <VictoryLine />
        { showSymbol && <VictoryScatter /> }
      </VictoryGroup>
    </VictoryChart>
  )
}

export default LineGraph