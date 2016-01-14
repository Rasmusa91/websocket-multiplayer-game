function CharacterAIController(parent) {
    this.parent = parent;
}

CharacterAIController.prototype.update = function()
{
    if(this.parent.sprite.pos.equals(this.parent.wantedPos)) {
        this.moveToNextHistogram();
    }
};

CharacterAIController.prototype.moveToNextHistogram = function()
{
    if(this.parent.owner.moveHistory.length > 0)
    {
        this.parent.setWantedPosition(new Appelicious.Vector2(this.parent.owner.moveHistory[0].pos.x, this.parent.owner.moveHistory[0].pos.y));
        this.parent.owner.moveHistory.splice(0, 1);
    }
};
