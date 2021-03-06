import jslizer from 'jslizer';
let CoreFactory = jslizer.CoreFactory;
import BaseApiService from './../base/base-api-service'

class BaseAngularApiService extends BaseApiService {

    constructor(loadingController = null) {
        super();
        this.loadingController = loadingController;
    }

    apiExecutionOperations() {
        if (CoreFactory.objectHelper.isNotNull(this.loadingController)) {
            this.loadingController.show();
        }
    }

}

export default BaseAngularApiService;
