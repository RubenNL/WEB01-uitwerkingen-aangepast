var expect = chai.expect;

describe("De Hello World Test", function() {
    it("de functie helloWorld zou 'HelloWorld' terug moeten geven", function() {
        expect(helloWorld()).to.be.equal('Hello World');
    });
});