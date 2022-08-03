import React, { useRef, useLayoutEffect } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5xy from "@amcharts/amcharts5/xy"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import { data } from "./data"

export const MultiChart: React.FC = (): JSX.Element => {
	// https://www.amcharts.com/docs/v5/getting-started/integrations/react/
	useLayoutEffect(() => {
		console.log("rendering")
		let root = am5.Root.new("chartdiv")

		root.setThemes([am5themes_Animated.new(root)])

		let chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				panX: false,
				panY: false,
				wheelX: "panX",
				wheelY: "zoomX",
				layout: root.verticalLayout,
			})
		)

		// Create Y-axis
		let yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				renderer: am5xy.AxisRendererY.new(root, {}),
			})
		)

		// Create X-Axis
		let xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(root, {
				renderer: am5xy.AxisRendererX.new(root, {}),
				categoryField: "category",
			})
		)

		xAxis.data.setAll(data)

		// Create series
		let series1 = chart.series.push(
			am5xy.ColumnSeries.new(root, {
				name: "Series",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "value1",
				categoryXField: "category",
			})
		)
		series1.data.setAll(data)

		let series2 = chart.series.push(
			am5xy.LineSeries.new(root, {
				name: "Series",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "value2",
				categoryXField: "category",
			})
		)
		series2.data.setAll(data)

		series1.columns.template.setAll({
			tooltipText: "{categoryX}: {valueY}",
			width: am5.percent(90),
			tooltipY: 0,
		})

		series2.bullets.push(function () {
			return am5.Bullet.new(root, {
				sprite: am5.Circle.new(root, {
					radius: 5,
					fill: series2.get("fill"),
				}),
			})
		})

		// Add legend
		let legend = chart.children.push(am5.Legend.new(root, {}))
		legend.data.setAll(chart.series.values)

		// Add cursor
		chart.set("cursor", am5xy.XYCursor.new(root, {}))

		return () => {
			root.dispose()
		}
	}, [])

	return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
}
