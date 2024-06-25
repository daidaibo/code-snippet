import { Controller, RequestMapping, RequestMethod } from '../core/decorator'

@Controller('/test')
export default class testController {
  @RequestMapping(RequestMethod.GET, '/get')
  async get(ctx, next) {
    ctx.body = 'test'
  }
}
