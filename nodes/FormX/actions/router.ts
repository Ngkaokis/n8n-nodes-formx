import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import * as document from './document/Document.resource';
import { FormxType } from './node.type';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	let returnData: INodeExecutionData[] = [];

	const resource = this.getNodeParameter('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	const formx = {
		resource,
		operation,
	} as FormxType;

	const resourceMap = {
		document: document,
	};

	for (let i = 0; i < items.length; i++) {
		try {
			returnData.push(
				...(await resourceMap[formx.resource][formx.operation].execute.call(this, i)),
			);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}
