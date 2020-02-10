import { describe, it } from "mocha"
import RootStore from "../../components/stores/root"
import { createSchema, validate } from "./root.test"
import Joi from "@hapi/joi"

export const scoreTests = () => {
    describe("Score tests", () => {
        it("set a score", (done) => {
            const rootStore = new RootStore()
            const schema = createSchema()

            // invoke action
            rootStore.scoresStore.setScore(0, 5);

            // validate array change
            schema.scoresStore.scores = Joi.array().length(4)
            const { error } = schema.scoresStore.scores.validate([5, 0, 0, 0])
            if (error) throw error

            // if this is not included then the test will fail due to improper schema validation on observables
            schema.overallScoreStore.overallScore = Joi.number().equal(1.25)
            schema.overallScoreStore.overallScoreTwo = Joi.number().equal(2.5)

            validate(schema, rootStore)
            done()
        })
    })    
}
